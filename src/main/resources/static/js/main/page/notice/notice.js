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
            const content = { kr: "공지사항이 없습니다.", eng: "There are no announcements.", jp: "お知らせはありません." };
            const category = { kr: "카테고리", eng: "Category", jp: "カテゴリー" };
            const title = { kr: "제목", eng: "Title", jp: "タイトル" };
            const writer = { kr: "작성자", eng: "Writer", jp: "作成者" };
            const view = { kr: "조회수", eng: "Views", jp: "閲覧数" };
            const creationDate = { kr: "작성일", eng: "Creation date", jp: "作成日" };
            const language = document.getElementById('language').value;
            const table = new Tabulator(target, {
                locale: 'ko-kr',
                langs: TableUtil.setDefaults(),
                layout: 'fitColumns',
                placeholder: `<div>
                                <div class="mt-3">${content[language]}</div>
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
                    {title: category[language], field: "category", tooltip: true, headerTooltip: true, headerFilterParams: {values: ["company"]}, headerSort: false, hozAlign: "center", headerHozAlign: "center",
                        formatter: function(cell) {
                            var originalValue = cell.getValue();
                            if (originalValue === "news") {
                                return "뉴스";
                            } else {
                                return originalValue;
                            }
                        }
                    },
                    {title: title[language], field: "title", tooltip: true, headerTooltip: true, headerSort: false, hozAlign: "center", headerHozAlign: "center", },
                    {title: writer[language], field: "createUser", tooltip: true, headerTooltip: true, headerSort: false, hozAlign: "center", headerHozAlign: "center",},
                    {title: view[language], field: "hit", tooltip: true, headerTooltip: true, headerSort: false, hozAlign: "center", headerHozAlign: "center",},
                    {title: creationDate[language], field: "createDate", tooltip: true, headerTooltip: true, headerSort: false, hozAlign: "center", headerHozAlign: "center",
                        formatter: function(cell, formatterParams, onRendered) {
                            var date = cell.getValue();
                            var formattedDate = new Date(date);
                            var formattedString = formattedDate.getFullYear().toString() + '-' +
                                                ('0' + (formattedDate.getMonth() + 1)).slice(-2) + '-' +
                                                ('0' + formattedDate.getDate()).slice(-2) + ' ' +
                                                ('0' + formattedDate.getHours()).slice(-2) + ':' +
                                                ('0' + formattedDate.getMinutes()).slice(-2);
                            return formattedString;
                        },
                    },
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