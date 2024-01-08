$(function(){
    const Content = {
        params: {},
        load: function(params){
            this.params = params;
            this.event();
        },
        event: function() {
            const table = Table.load('#table');

            const card = $('.card');
            card.find('*[role="action"]').click(async function(e){
                const action = this.dataset.action;
                const range = this.dataset.range;
                const selected = table.getSelectedData().map(e => e.recKey);

                if(action === 'del'){
                    var data = {}
                    switch (range) {
                        case "list":
                            if(selected.length === 0){
                                Alert.warning({text: '접속기록을 먼저 선택해주세요!'});
                                return;
                            }
                            data = {
                                type: 'list',
                                idListLong: selected
                            }
                            AjaxUtil.requestBody({
                                url: '/api/adm/log/access/delete',
                                data: data,
                                table: 'table',
                                successMessage: '성공적으로 삭제되었습니다',
                                failMessage: '삭제중 오류가 발생하였습니다.',
                            })
                            break
                        case "all":
                            await Alert.confirm({
                                title: '전체 삭제',
                                text: `전체 접속기록을 삭제하시겠습니까?`
                            }, async function (result) {
                                if (!result.isConfirmed) return;
                                data = {
                                    type: 'specific',
                                }
                                AjaxUtil.requestBody({
                                    url: '/api/adm/log/access/delete',
                                    data: data,
                                    table: 'table',
                                    successMessage: '성공적으로 삭제되었습니다',
                                    failMessage: '삭제중 오류가 발생하였습니다.',
                                })
                            })
                            break
                        case "range":
                            // var stDate = prompt("삭제 할 시작 기간을 입력 해 주세요.(예시: 2023-12-15)")
                            // var enDate = prompt("삭제 할 종료 기간을 입력 해 주세요.(예시: 2023-12-31)")

                            Swal.fire({
                                title: '기간별 삭제 설정',
                                html: `
                                <input type="text" id="start-date" class="swal2-input" placeholder="시작일 예시) 2023-12-15">
                                <input type="text" id="end-date" class="swal2-input" placeholder="종료일 예시) 2023-12-31">
                                <div id="error-message" style="color: red; margin-top: 5px;"></div>
                                `,
                                icon: 'info',
                                customClass: {
                                    confirmButton: `btn btn-info`,
                                    cancelButton: `btn btn-secondary`
                                },
                                showCancelButton: true,
                                confirmButtonText: '삭제',
                                cancelButtonText: '취소',
                                showLoaderOnConfirm: true,
                                allowOutsideClick: () => !Swal.isLoading(),
                                preConfirm: () => {
                                    const startDate = document.getElementById('start-date').value;
                                    const endDate = document.getElementById('end-date').value;

                                    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                                    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
                                        document.getElementById('error-message').innerHTML = '날짜 형식을 확인해주세요 (예: 2023-12-15)';
                                        return false;
                                    }

                                    return { startDate, endDate };
                                }
                            }).then((result) => {
                                if (!result.isConfirmed) return;
                                data = {
                                    type: 'range',
                                    startDate: result.value.startDate,
                                    endDate: result.value.endDate
                                }
                                AjaxUtil.requestBody({
                                    url: '/api/adm/log/access/delete',
                                    data: data,
                                    table: 'table',
                                    successMessage: '성공적으로 삭제되었습니다',
                                    failMessage: '삭제중 오류가 발생하였습니다.',
                                })
                            });
                            break
                    }
                } else if (action == "download") {
                    const range = this.dataset.range;
                    if (selected.length === 0) {
                        Alert.warning({text: '접속 기록을 먼저 선택해주세요!'});
                        return;
                    }
                    TableUtil.download(table, 'excel', '접속 기록 목록');
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