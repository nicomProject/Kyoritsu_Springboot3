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
                    if(selected.length === 0){
                        Alert.warning({text: '채용문의 관리를 먼저 선택해주세요!'});
                        return;
                    } else if(range === 'list' && selected.length > 0){
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
                    }else{
                        AjaxUtil.requestBody({
                            url: '/api/inquiry/delete',
                            data: {
                                type: 'specific',
                            },
                            table: 'table',
                            successMessage: '성공적으로 삭제되었습니다',
                            failMessage: '삭제중 오류가 발생하였습니다.',
                        })

                    }
                    // ... (기존의 삭제 로직을 이곳에 삽입)
                }
                else if (action === 'file') {
                    const range = this.dataset.range;
                    if (selected.length === 0) {
                        Alert.warning({text: '채용문의 관리를 먼저 선택해주세요!'});
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
                placeholder: TableUtil.getPlaceholder('조건에 맞는 공지사항이 없습니다.'),
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
                    {title: '제목', field: "title", tooltip: true, headerTooltip: true, headerFilter: 'input'},
                    {title: '등록일시', field: "createDate", tooltip: true, headerTooltip: true},


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