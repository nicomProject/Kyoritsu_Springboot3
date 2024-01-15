$(function () {
    const Content = {
        params: {},
        categoryItems: {},
        items: {},
        load: function (params) {
            this.params = params;
            // let items = [];
            AjaxUtil.request({
                url: '/api/main/setting/category',
                async: false,
                success: function (data) {
                    items = data.result.items;
                    categoryItems = Array.from(new Set(items.map(item => item.menu.recKey))).map(recKey => items.find(item => item.menu.recKey === recKey));
                }
            });
            Data.load({role: true, menu: true});
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
                    window.location.href = '/admin/introduction/detail'
                }
                else if(action === 'check'){
                    if(selected.length === 1){
                        AjaxUtil.requestBody({
                            url: '/api/introductions/check',
                            data: {
                                idListLong: selected,
                                type: 'one',
                            },
                            table: 'table',
                            success: function(data) {
                                Alert.success({text: '성공적으로 표기되었습니다.'}, function(){
                                    location.reload();
                                });
                            },
                            error: function(e) {
                                Alert.error({text: '표기중 오류가 발생하였습니다.'}, function(){
                                    location.reload();
                                });
                            }
                        })
                    }else{
                        if(selected.length === 0){
                            Alert.warning({text: '소개글을 먼저 선택해주세요!'})

                        }else if(selected.length > 1){
                            Alert.warning({text: '선택한 항목이 2항목 이상입니다.'})
                        }
                    }
                }
                else if (action === 'del') {
                    if(selected.length === 0 && range !== 'all'){
                        Alert.warning({text: '소개글을 먼저 선택해주세요!'});
                        return;
                    } else if(range === 'list' && selected.length > 0){
                        // 소개글 삭제 확인
                        Alert.confirm({
                            title: '선택 삭제',
                            text: `선택한 소개글을 삭제하시겠습니까?`
                        }, function (result) {
                            // 확인 버튼 이외는 무시
                            if (!result.isConfirmed) return;
                            // 선택한 소개글 삭제 요청
                            AjaxUtil.requestBody({
                                url: '/api/introductions/delete',
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
                        // 소개글 삭제 확인
                        Alert.confirm({
                            title: '전체 삭제',
                            text: `전체 소개글을 삭제하시겠습니까?`
                        }, function (result) {
                            // 확인 버튼 이외는 무시
                            if (!result.isConfirmed) return;
                            // 전체 소개글 삭제 요청
                            AjaxUtil.requestBody({
                                url: '/api/introductions/delete',
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
                        Alert.warning({text: '소개글을 먼저 선택해주세요!'});
                        return;
                    }
                    else if (range === 'download') {
                        TableUtil.download(table, 'excel', '소개글 목록');
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
            const subMenuCheckHash = Data.subMenuCheckHash || {};
            const subMenuHash = Data.subMenuHash || {};
            const allMenuHash = Data.MenuHash || {};
            const menuHash = Object.fromEntries(Object.entries(allMenuHash).slice(0,2));
            const table = new Tabulator(target, {
                locale: 'ko-kr',
                langs: TableUtil.setDefaults(),
                layout: 'fitColumns',
                placeholder: TableUtil.getPlaceholder('조건에 맞는 소개글이 없습니다.'),
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
                    {title: '카테고리', field: "category", headerHozAlign: "center", tooltip: true, headerTooltip: true, headerFilter: 'select',
                        headerFilterParams: {
                            values: menuHash,
                        }, formatter: function(cell){
                            return menuHash[cell.getValue()] || cell.getValue();
                        }
                    },
                    {title: '서브 카테고리', field: "subcategory", headerHozAlign: "center", tooltip: true, headerTooltip: true, headerFilter: 'select', headerFilterParams: {
                            values: subMenuHash,
                        }, formatter: function(cell){
                            return subMenuHash[cell.getValue()] || cell.getValue();
                        }},
                    {title: '제목', field: "title", headerHozAlign: "center", tooltip: true, headerTooltip: true, headerFilter: 'input'},
                    {title: '소제목', field: "subtitle", headerHozAlign: "center", tooltip: true, headerTooltip: true, headerFilter: 'input'},
                    {
                        title: '등록 일시',
                        field: "createDate",
                        headerHozAlign: "center",
                        tooltip: true,
                        headerTooltip: true
                    },
                    {
                        title: '상태',
                        headerHozAlign: "center", 
                        headerFilterParams: {
                            values: subMenuHash,
                        }, formatter: function(cell){
                            const data = cell.getRow().getData();
                            const subcategory = data.subcategory;
                            console.log(subcategory)
                            const subMenuCheckHash = Data.subMenuCheckHash[subcategory];
                            return data.recKey == subMenuCheckHash;
                        },
                    }
                ],
            });

            const events = {

                rowClick: function (e, row) {
                    window.location.href = '/admin/introduction/detail/' + row.getData().recKey;

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
        url: "/api/introductions/find"
    });
})