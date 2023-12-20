$(function(){
    const Content = {
        params: {},
        load: function(params){
            this.params = params;
            this.draw();
        },
        draw: function(){
            const table = Table.load('#table');
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
                placeholder: TableUtil.getPlaceholder('조건에 맞는 접속 기록이 없습니다.'),
                headerFilterPlaceholder: '검색어 입력',
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
                    {
                        title: '<i class="fas fa-clock"></i> 로그인 일시',
                        field: "loginDate",
                        tooltip: true,
                        headerTooltip: true
                    },
                    {title: '로그인 IP', field: "loginIp", tooltip: true, headerTooltip: true, headerFilter: 'input'},
                    {title: '로그인 아이디', field: "loginId", tooltip: true, headerTooltip: true, headerFilter: 'input'},
                    {
                        title: '로그인 성공 여부',
                        field: "loginResult",
                        vertAlign: 'middle',
                        hozAlign: 'center',
                        headerHozAlign: 'center',
                        headerSort: false,
                        formatter: function (cell) {
                            let element = IconUtil.success + '<span class="status-title status-1">성공</span>'
                            if (cell.getValue() === 0) {
                                element = IconUtil.fail + '<span class="status-title status-1">실패</span>'
                            }
                            return element
                        }
                    },
                ],
            });

            const events = {
                rowClick: function (e, row) {
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
        url: "/api/adm/log/access"
    });
})