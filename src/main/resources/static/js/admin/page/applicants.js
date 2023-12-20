$(function () {
    const Content = {
        params: {},
        load: function (params) {
            this.params = params;
            Data.load({role: true});
            let items = [];

            const category = $("#category");
            const table = Table.load('#table');
            const tableDetail = TableDetail.load('#tableDetail');


            AjaxUtil.request({
                url: '/api/category/find',
                async: false,
                success: function (data) {
                    items = data.result.items;
                }
            });
            items.forEach(item => {
                category.append($('<option>', {
                        value: item.recKey,
                        text: item.categoryName,
                    }
                ));
            })

            category.on('change', function(){
                AjaxUtil.requestBody({
                    url: '/api/job/findCategorySelf',
                    data: {
                        category : category.val()
                    },
                    success: function (data) {
                        if (data.code == 200) {
                            table.setData(data.result.items);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                html: "조회가 실패하였습니다",
                            })
                        }
                    }
                })
            })
            this.event();
        },
        event: function () {

            const card = $('.card');

            $('#searchText').on('keydown', function(event) {
                if (event.key === 'Enter') {
                    performSearch();
                }
            });

            $('.btn[role="action"][data-action="search"]').on('click', function() {
                performSearch();
            });

            function performSearch() {
                const searchText = $('#searchText').val();
                AjaxUtil.requestBody({
                    url: '/api/job/search',
                    data: {
                        title: searchText
                    },
                    success: function (data) {
                        console.log(data);
                        Table.table.setData(data.result.items);
                    }
                });
            }
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
                    {title: '제목', field: "title", tooltip: true, headerTooltip: true},
                    {title: '기간', field: "subtitle", tooltip: true, headerTooltip: true},
                    {title: '등록일시', field: "createUser", tooltip: true, headerTooltip: true},
                    {title: '지원자 현황', field: "createDate", tooltip: true, headerTooltip: true},

                ],
            });

            const events = {
                rowClick: function (e, row) {
                    // window.location.href = '/admin/applicants/' + row.getData().recKey;
                        let urlDetail = '/api/applicant/findSelf/' + row.getData().recKey
                        Content.params.urlDetail = urlDetail;
                    const tableDetail = TableDetail.load('#tableDetail');
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

    const TableDetail = {
        tableDetail: null,
        load: function (target) {
            return this.draw(target);
        },
        draw: function (target) {
            const that = this;

            console.log(Content.params);

            const roleHash = Data.roleHash || {};
            const tableDetail = new Tabulator(target, {
                locale: 'ko-kr',
                langs: TableUtil.setDefaults(),
                layout: 'fitColumns',
                placeholder: TableUtil.getPlaceholder('조건에 맞는 공지사항이 없습니다.'),
                pagination: false,
                paginationSize: paginationConfig.size,
                paginationSizeSelector: paginationConfig.selector,
                ajaxLoaderLoading: TableUtil.getLoaderLoading(),
                ajaxURL: Content.params.urlDetail,
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
                    {title: '이름', field: "name", tooltip: true, headerTooltip: true},
                    {title: '제목', field: "name", tooltip: true, headerTooltip: true},
                    {title: '연락처', field: "name", tooltip: true, headerTooltip: true},

                ],
            });

            const events = {

                rowClick: function (e, row) {
                    window.location.href = '/admin/applicant/detail/' + row.getData().recKey;

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
                tableDetail.on(event, callback);
            });

            this.table = tableDetail;
            return tableDetail;
        },
    };

    Content.load({
        key: $('.param[name="key"]').val() || '',
        url: "/api/job/find",
    });
})