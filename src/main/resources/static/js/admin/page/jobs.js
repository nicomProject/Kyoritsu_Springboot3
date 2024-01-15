$(function () {

    const Content = {
        params: {}, // url 저장
        load: function (params) {
            this.params = params;

            // 현재 채용공고 카테고리 및 채용공고 지원분야 요청
            Data.load({role: true, recruit: true});

            // event 등록
            this.event();
        },

        // 이벤트 등록
        event: function () {
            const table = Table.load('#table');

            // 버튼 이벤트 등록
            const card = $('.card');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;
                const range = this.dataset.range;
                const selected = table.getSelectedData().map(e => e.recKey);

                // 채용공고 등록 버튼 클릭 이벤트 등록
                if(action === 'add'){
                    // 채용공고 작성 페이지로 이동
                    window.location.href = '/admin/job/detail'
                }

                // 채용공고 삭제 버튼 클릭 이벤트 등록
                else if (action === 'del') {
                    // 선택 삭제
                    if(range === 'list'){
                        // 채용공고 선택 확인
                        if(selected.length === 0){
                            Alert.warning({text: '채용공고를 먼저 선택해주세요!'});
                            return;
                        }

                        // 채용공고 삭제 확인
                        Alert.confirm({
                            title: '선택 삭제',
                            text: `선택한 채용공고를 삭제하시겠습니까?`
                        }, function (result) {
                            // 확인 버튼 이외는 무시
                            if (!result.isConfirmed) return;

                            // 선택한 채용공고 삭제 요청
                            AjaxUtil.requestBody({
                                url: '/api/job/delete',
                                data: {
                                    type: 'list',
                                    idListLong: selected
                                },
                                table: 'table',
                                successMessage: '성공적으로 삭제되었습니다',
                                failMessage: '삭제중 오류가 발생하였습니다.',
                            })
                        });
                    } 
                    // 전체 삭제
                    else if (range == 'all') {
                        // 채용공고 삭제 확인
                        Alert.confirm({
                            title: '전체 삭제',
                            text: `전체 채용공고를 삭제하시겠습니까?`
                        }, function (result) {
                            // 확인 버튼 이외는 무시
                            if (!result.isConfirmed) return;
                            // 전체 채용공고 삭제 요청
                            AjaxUtil.requestBody({
                                url: '/api/job/delete',
                                data: {
                                    type: 'specific',
                                },
                                table: 'table',
                                successMessage: '성공적으로 삭제되었습니다',
                                failMessage: '삭제중 오류가 발생하였습니다.',
                            })
                        });
                    }
                }

                // 채용공고 지원분야 관리 버튼 이벤트 등록
                else if (action === 'support_add'){
                    const request = {
                        msg: '알림창 메세지를 수정해주세요.'
                    };
                    // modal 창으로 이동
                    ParamManager.show('jobModal', action, request);
                }

                // 채용공고 엑셀 버튼 이벤트 등록
                else if (action === 'file') {
                    const range = this.dataset.range;
                    // 채용공고 선택 확인
                    if (selected.length === 0) {
                        Alert.warning({text: '채용공고를 먼저 선택해주세요!'});
                        return;
                    }

                    // 다운로드
                    else if (range === 'download') {
                        const tableData = table.getData();
                        tableData.forEach(item => {
                            const fromDate = item.fromDate || 0;
                            const toDate = item.toDate || 0;
                            item["fromDate + toDate"] = fromDate + "~" +toDate;
                        });
                        table.setData(tableData);
                        TableUtil.download(table, 'excel', '채용공고 목록');
                    }
                }
            })
        }
    };

    // Table 정보에 대한 모음집 
    const Table = {
        table: null,
        
        // 테이블 로드
        load: function (target) {
            // 테이블 제작
            return this.draw(target);
        },

        // 테이블 제작
        draw: function (target) {
            const that = this;
            const categoryHash = Data.recruitCategoryHash || {};
            const supportHash = Data.recruitSupportHash || {};

            const table = new Tabulator(target, {
                locale: 'ko-kr',
                langs: TableUtil.setDefaults(),
                layout: 'fitColumns',
                placeholder: TableUtil.getPlaceholder('조건에 맞는 채용공고가 없습니다.'),
                pagination: false,
                paginationSize: paginationConfig.size,
                paginationSizeSelector: paginationConfig.selector,
                ajaxLoaderLoading: TableUtil.getLoaderLoading(),
                ajaxURL: Content.params.url,
                ajaxConfig: ajaxConfig,
                dataReceiveParams: {
                    "last_page": "lastPage",
                    "data": "items"
                },
                ajaxResponse: function (url, params, response) {
                    if (AjaxUtil.errorHandling(response)) {
                        return [];
                    }
                    response = response.result;
                    console.log(response.items);
                    return response.items;
                },
                ajaxError: TableUtil.ajaxError,
                columnHeaderVertAlign: "middle",
                columns: [
                    // 선택 박스 column 설정
                    {
                        formatter: "rowSelection",
                        titleFormatter: "rowSelection",
                        titleFormatterParams: {rowRange: "active"},
                        hozAlign: "center",
                        vertAlign: 'middle',
                        widthGrow: 0.5,
                        headerHozAlign: "center",
                        cellClick: function (e, cell) {
                            cell._cell.row.component.toggleSelect();
                        },
                        width: 30,
                        download: false,
                        headerSort: false
                    },

                    // No. column 설정
                    {
                        title: "NO",
                        formatter: "rownum",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        width: 70,
                        download: false,
                        headerSort: false
                    },

                    // 카테고리 column 설정
                    {title: '카테고리', field: "category", tooltip: true, headerTooltip: true, headerFilter: 'select', headerFilterParams: {
                            values: categoryHash,
                        }, formatter: function(cell) {
                            return categoryHash[cell.getValue()] || cell.getValue();
                        }
                    },

                    // 지원분야 column 설정
                    {title: '지원분야', field: "support", tooltip: true, headerTooltip: true, headerFilter: 'select', headerFilterParams: {
                            values: supportHash,
                        }, formatter: function(cell) {
                            return supportHash[cell.getValue()] || cell.getValue();
                        }
                    },
                    
                    // 제목 column 설정
                    {title: '제목', field: "title", tooltip: true, headerTooltip: true, headerFilter: 'input'},
                    
                    // 등록 일시 column 설정
                    {title: '등록일시', field: 'createDate', tooltip: true, headerTooltip: true, customDisplay: true},
                    
                    // 공고 기간 column 설정
                    {
                        title: '공고기간',
                        field: "fromDate",
                        tooltip: true,
                        headerTooltip: true,
                        formatter: function(cell, formatterParams, onRendered) {
                            const data = cell.getData();
                            const fromDate = data.fromDate.slice(0, 10) || 0; // fromDate가 없으면 0으로 가정
                            const toDate = data.toDate.slice(0, 10) || 0;     // toDate가 없으면 0으로 가정
                            const result = fromDate + "~" + toDate;
                            return result;
                        }
                    },
                    
                    // 지원자 현황 column 설정
                    {
                        title: '지원자현황', 
                        field: "applicantCnt", 
                        tooltip: true, 
                        headerTooltip: true,
                        formatter: function(cell, formatterParams, onRendered) {
                                const data = cell.getData();
                                const result = data.applicantCnt + "명";
                                return result;
                            }
                    },
                ],
            });

            // 채용공고 클릭 이벤트 작성
            const events = {
                rowClick: function (e, row) {
                    window.location.href = '/admin/job/detail/' + row.getData().recKey;
                },
                downloadComplete: function () {
                    Swal.close();
                },
                cellMouseEnter: function (e, cell, row) {
                    TableUtil.cellMouseEnter(e, cell, row)
                },
                ajaxError: TableUtil.ajaxError,
            };

            Object.entries(events).forEach(([event, callback]) => {
                table.on(event, callback);
            });

            this.table = table;
            return table;
        },
    };

    Content.load({
        url: "/api/job/find"
    });
})