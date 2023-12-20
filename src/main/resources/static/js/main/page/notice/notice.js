$(function () {
    const Content = {
        params: {},
        load: function (params) {
            this.params = params;

            this.event();
        },
        event: function () {
            Table.load('#table');
        }
    }

    const Table = {
        table: null,
        load: function (target) {
            return this.draw(target);
        },
        draw: function (target) {
            const that = this;
            const table = new Tabulator(target, {
                locale: 'ko-kr',
                langs: TableUtil.setDefaults(),
                layout: 'fitColumns',
                placeholder: `<div>
                                <div class="mt-3">공지사항이 없습니다.</div>
                              </div>`,
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
                        title: "NO",
                        formatter: "rownum",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        width: 70,
                        download: false,
                        headerSort: false
                    },
                    {title: '카테고리', field: "category", tooltip: true, headerTooltip: true, headerFilterParams: {values: ["company"]}, headerSort: false, hozAlign: "center", headerHozAlign: "center",
                        formatter: function(cell) {
                            var originalValue = cell.getValue();
                            if (originalValue === "news") {
                                return "뉴스";
                            } else {
                                return originalValue;
                            }
                        }
                    },
                    {title: '제목', field: "title", tooltip: true, headerTooltip: true, headerSort: false, hozAlign: "center", headerHozAlign: "center", },
                    {title: '작성자', field: "createUser", tooltip: true, headerTooltip: true, headerSort: false, hozAlign: "center", headerHozAlign: "center",},
                    {title: '조회수', field: "hit", tooltip: true, headerTooltip: true, headerSort: false, hozAlign: "center", headerHozAlign: "center",},
                    {title: '작성일', field: "createDate", tooltip: true, headerTooltip: true, headerSort: false, hozAlign: "center", headerHozAlign: "center",},
                ],
            });

            const events = {
                rowClick: function (e, row){
                    window.location.href = '/notice/notice/detail/' + row.getData().recKey;
                },
                ajaxError: TableUtil.ajaxError,
            }

            Object.entries(events).forEach(([event, callback]) => {
                table.on(event, callback);
            });

            this.table = table;
            return table;
        }
    }

    Content.load({
        url: "/api/notice/find"
    });
});