$(function () {
    const Content = {
        categoryHash:{},
        params: {},
        load: function (params) {
            const that = this;
            let items = [];
            this.params = params;

            AjaxUtil.request({
                url: '/api/category/find',
                async: false,
                success: function (data) {
                    items = data.result.items;
                    items.forEach(menu => {
                        that.categoryHash[menu.recKey] = menu.categoryName;
                    })
                }
            });
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

                if(action === 'add'){
                    window.location.href = '/admin/job/detail'
                }
                else if (action === 'del') {
                    if(range === 'list'){
                        if(selected.length === 0){
                            Alert.warning({text: '채용공고를 먼저 선택해주세요!'});
                            return;
                        }

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
                    } else if (range == 'all') {
                        Alert.confirm({
                            title: '전체 삭제',
                            text: `전체 채용공고를 삭제하시겠습니까?`
                        }, function (result) {
                            if (!result.isConfirmed) return;
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
                else if (action === 'category_add'){
                    const request = {
                        msg: '알림창 메세지를 수정해주세요.'
                    };
                    ParamManager.show('jobModal', action, request);
                }
                else if (action === 'file') {
                    const range = this.dataset.range;
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
                placeholder: TableUtil.getPlaceholder('현재 채용공고가 없습니다.'),
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
                    return response.items;
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
                    {title: '구분', field: "category", tooltip: true, headerTooltip: true, headerFilter: 'select',
                        formatter: function(cell) {
                            var data = cell.getData()
                            console.log(cell)
                            console.log(data)
                            if (data.category == "") data.category = "도미인 호텔";
                            return data.category
                        }
                    },
                    {title: '제목', field: "title", tooltip: true, headerTooltip: true, headerFilter: 'input'},
                    // {title: '기간', field: "fromDate + toDate", tooltip: true, headerTooltip: true},

                   {title: '등록일시', field: 'createDate', tooltip: true, headerTooltip: true, customDisplay: true},
                    {
                        title: '공고기간',
                        field: "fromDate + toDate",
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
                    {title: '지원자현황', field: "", tooltip: true, headerTooltip: true},

                ],
            });

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