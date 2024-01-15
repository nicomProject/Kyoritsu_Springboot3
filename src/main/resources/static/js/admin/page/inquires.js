$(function () {
    const Content = {
        params: {},
        load: function (params) {
            this.params = params;

            Data.load({role: true});
            this.event();
        },
        event: function () {
            const table = Table.load('#table');

            const card = $('.card');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;
                const range = this.dataset.range;
                const selected = table.getSelectedData().map(e => e.recKey);


                if (action === 'del') {
                    if(selected.length === 0 && range !== 'all'){
                        Alert.warning({text: '채용문의를 먼저 선택해주세요!'});
                        return;
                    } else if(range === 'list' && selected.length > 0){
                        // 채용문의 삭제 확인
                        Alert.confirm({
                            title: '선택 삭제',
                            text: `선택한 채용문의를 삭제하시겠습니까?`
                        }, function (result) {
                            // 확인 버튼 이외는 무시
                            if (!result.isConfirmed) return;
                            // 선택한 채용문의 삭제 요청
                            AjaxUtil.requestBody({
                                url: '/api/inquiry/delete',
                                data: {
                                    type: 'list',
                                    idListLong: selected
                                },
                                table: 'table',
                                successMessage: '성공적으로 삭제되었습니다',
                                failMessage: '삭제중 오류가 발생하였습니다.',
                            })
                        });
                    }else if(range == 'all'){
                        // 채용문의 삭제 확인
                        Alert.confirm({
                            title: '전체 삭제',
                            text: `전체 채용문의를 삭제하시겠습니까?`
                        }, function (result) {
                            // 확인 버튼 이외는 무시
                            if (!result.isConfirmed) return;
                            // 선택한 채용문의 삭제 요청
                            AjaxUtil.requestBody({
                                url: '/api/inquiry/delete',
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
                else if (action === 'file') {
                    const range = this.dataset.range;
                    if (selected.length === 0) {
                        Alert.warning({text: '채용문의를 먼저 선택해주세요!'});
                        return;
                    }
                    // 다운로드
                    else if (range === 'download') {
                        console.log(table.getData())
                        TableUtil.download(table, 'excel', '채용문의 관리 목록');
                    }
                }
            })
        }
    };

    const Table = {
        table: null,
        load: function (target) {
            return this.draw(target);
        },
        draw: function (target) {
            const that = this;

            const roleHash = Data.roleHash || {};
            const table = new Tabulator(target, {
                locale: 'ko-kr',
                langs: TableUtil.setDefaults(),
                layout: 'fitColumns',
                placeholder: TableUtil.getPlaceholder('조건에 맞는 채용문의가 없습니다.'),
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
                    return response.items || [];
                },
                ajaxError: TableUtil.ajaxError,
                columnHeaderVertAlign: "middle",
                columns: [
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
                    {
                        title: "NO",
                        formatter: "rownum",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        width: 70,
                        download: false,
                        headerSort: false
                    },
                    {title: '제목', field: "inquiryTitle", tooltip: true, headerTooltip: true, headerFilter: 'input'},
                    {title: '상태', field: "answerYn", tooltip: true, headerTooltip: true, headerFilter: 'select',
                        headerFilterParams: {
                            values: {'답변대기':'답변대기', '답변완료':'답변완료'},
                        }
                    },
                    {title: '작성일', field: "createDate", tooltip: true, headerTooltip: true}
                ],
            });

            const events = {

                rowClick: function (e, row) {
                    window.location.href = '/admin/inquiry/detail/' + row.getData().recKey;

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
        url: "/api/inquiry/find"
    });
})