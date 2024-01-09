/**
 * @Group Animate
 * @Desc 애니메이션 이벤트 관리
 */
const Animation = {
    /**
     * [Animation] animation load
     * @param {jQuery} container target 객체
     * @param {string} classList Animation Class List
     * @param {function} onHide 애니메이션이 사라지고 난뒤 Callback
     */
    load: function (container, classList, onHide) {
        if (onHide === undefined) onHide = () => {
        };
        container.addClass(classList);
        container[0].addEventListener('animationend', () => {
            container.removeClass(classList);
            onHide();
        });
    },
    /**
     * [Animation] number 애니메이션
     * @param {jQuery} container
     * @param {number} value
     */
    number: function (container, value) {
        $({val: 0}).animate({val: value}, {
            duration: 1000,
            step: function () {
                let num = (Math.floor(this.val)).toLocaleString();
                container.text(num);
            },
            complete: function () {
                let num = (Math.floor(this.val)).toLocaleString();
                container.text(num);
            }
        });
    },
};

const Utils = {
    /**
     *
     * @param {object} map {key: 숫자}
     * @returns {number} 숫자들의 합
     */
    sumMap: function (map) {
        return Object.values(map).reduce((x, y) => x + y);
    },
    calcByteSize: function (bytes) {
        bytes = parseInt(bytes);
        let s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

        let e = Math.floor(Math.log(bytes) / Math.log(1024));

        if (e === "-Infinity") return "0 " + s[0];
        else {
            return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
        }
    },
    calcUnitSize: function (num) {
        // 단위보다 작을경우
        if (num < 1000) return num;

        /**
         * 단위
         * K (Kilo) - 1,000
         * M (Million) - 1,000,000
         * B (Billion) - 1,000,000,000
         */
        const unit = ['K', 'M', 'B']
        let cnt = 0;

        let division = num / 1000;
        while (division > 1000) {
            cnt += 1;
            division /= 1000;
        }

        return division.toFixed(1) + unit[cnt];
    },
    /**
     * map1의 키를 기준으로 map2가 변경되었는지 Check
     * @param map1 기준 map
     * @param map2 비교할 map
     * @returns {boolean}
     */
    compareMap: function (map1, map2) {
        for (let key of Object.keys(map1)) {
            if (map1[key] == map2[key]) continue;
            else return false;
        }
        return true;
    },
    /**
     * map1의 키를 기준으로 변경된 map Check
     * @param map1 origin map
     * @param map2 target map
     */
    diffMap: function (map1, map2) {
        const result = {};
        for (let key of Object.keys(map1)) {
            if (Object.keys(map2).includes(key) && map1[key] != map2[key]) {
                result[key] = map2[key];
            }
        }
        return result;
    },
    isSingleChar: function (str) {
        let strGa = 44032; // 가
        let strHih = 55203; // 힣

        let lastStrCode = str.charCodeAt(str.length - 1);
        if (lastStrCode < strGa || lastStrCode > strHih) {
            return false; //한글이 아닐 경우 false 반환
        }

        return ((lastStrCode - strGa) % 28 === 0);
    },
    leftPad: function (val, digit) {
        let result = '';
        val = val + '';

        digit = digit || 2;
        for (let i = 0; i < digit - val.length; i++) {
            result += '0';
        }
        result += val;
        return result;
    },
}
/**
 * @Group Tabulator
 * @Desc ajax config 관리 객체
 */
const ajaxConfig = {
    method: "GET", //set request type to Position
    headers: {
        "Content-type": 'application/json; charset=utf-8', //set specific content type
    }
};

/**
 * @Group Tabulator
 * @Desc pagination 설정 관리 객체
 */
const mobile = window.innerWidth <= 600;
const paginationConfig = {
    size: mobile ? 10 : 25,
    sizeProgressive: 100,
    selector: mobile ? [10, 15, 20] : [10, 15, 20, 25, 50, 100]
}

/**
 * @Group Tabulator
 * @Desc tabulator util
 */
const TableUtil = {
    /**
     *
     * @param {MouseEvent} e
     * @param cell
     * @param row
     * @param {Array<string>} except
     * @param {boolean} force overflow가 아닐시에도 tooltip 추가
     */
    cellMouseEnter: (e, cell, row, except, force) => {
        let excepts = new Set(except);
        excepts.add('NO');

        const column = cell.getColumn();
        const definition = column.getDefinition();
        const element = cell.getElement();
        const value = cell.getValue();

        const tooltip = definition.tooltip && true;
        // except 에 정의된 column 의 경우, 값이 공백이면 종료
        if (excepts.has(definition.title) || value === undefined || String(value).trim() === '') return;

        force = force && true;
        // cell 의 값이 overflow 가 아닌경우 종료
        if (!force && element.offsetWidth >= element.scrollWidth) return;

        if (tooltip) {
            element._tippy = tippy(element, {content: value, maxWidth: '450px', arrow: true, animation: 'fade'});
            element._tippy.show();
        }
    },
    scrollVertical: function (top) {
        if (top === undefined) return;
        if (top < 300) {
            $('.btn-top').addClass('hide');
        } else if (top > 300) {
            $('.btn-top').removeClass('hide');
        }
    },
    groupBy: (data, key) => {
        return data.reduce(function (carry, el) {
            let group = el[key];

            if (carry[group] === undefined) {
                carry[group] = [];
            }

            carry[group].push(el)
            return carry
        }, {})
    },
    ajaxRequestFunc: function (url, config, params) {
        let requestParams = {};
        const filters = params.filter || [];
        const sorters = params.sort || [];

        // 검색 조건
        filters.forEach(filter => {
            requestParams[filter.field] = filter.value;
        });

        // 정렬 조건
        sorters.forEach(sorter => {
            requestParams['sortField'] = sorter.field;
            requestParams['sortDir'] = sorter.dir;
        });

        // 페이징
        requestParams.pageIdx = params.pageIdx;
        requestParams.pageSize = params.pageSize;

        return new Promise(function (resolve, reject) {
            AjaxUtil.requestBody({
                url: url,
                data: requestParams,
                success: function (data) {
                    resolve(data);
                },
                fail: function () {
                    reject();
                }
            });
        })
    },
    parseParam: (obj) => {
        return Object.entries(obj).map(x => x[0] + '=' + x[1]).join('&');
    },
    setDefaults: () => {
        const langs = {
            'ko-kr': {
                pagination: {
                    first: '처음',
                    first_title: '첫 페이지',
                    last: '맨끝',
                    last_title: '마지막 페이지',
                    prev: '이전',
                    prev_title: '이전 페이지',
                    next: '다음',
                    next_title: '다음 페이지'
                }
            },
            'ko': {
                pagination: {
                    first: '<<',
                    first_title: '첫 페이지',
                    last: '>>',
                    last_title: '마지막 페이지',
                    prev: '<',
                    prev_title: '이전 페이지',
                    next: '>',
                    next_title: '다음 페이지'
                }
            },
            'en-us': {
                pagination: {
                    first: 'First',
                    first_title: 'First Page',
                    last: 'Last',
                    last_title: 'Last Page',
                    prev: 'Previous',
                    prev_title: 'Prev Page',
                    next: 'Next',
                    next_title: 'Next Page'
                }
            },
        };

        return langs;
    },
    download: function (table, target, file_name, callback) {
        let data = table.getData();
        if (data.length < 1) {
            Alert.warning({text: '출력할 데이터가 없습니다!'});
            return;
        }
        const curSize = table.getPageSize();
        const curPage = table.getPage();
        const maxSize = curSize * table.getPageMax();

        const DownloadFunc = {
            excel: function () {
                table.download("xlsx", file_name + '.xlsx', {
                    sheetName: file_name.split('(')[0],
                    documentProcessing: function (workbook) {
                        return workbook
                    }
                });
            },
            csv: function () {
                table.download("csv", file_name, {bom: true});
            }
        };

        if (!Object.keys(DownloadFunc).includes(target)) {
            console.warn('정의되지 않은 다운로드 타입입니다.', target)
            return;
        }
        if (table.options.paginationMode === 'remote') {
            table.setPageSize(maxSize).then(() => {
                DownloadFunc[target]();

                let result = table.setPageSize(curSize);
                if (curPage !== 1) {
                    result = table.setPage(curPage);
                }
                result.then(() => {
                    callback();
                })
            });
        } else {
            setTimeout(function () {
                DownloadFunc[target]();
            }, 100);
        }

        Alert.printLoading({});
    },
    getPlaceholder: function (msg) {
        return `<div>
			<img src="/static/images/emotion/sad_color.png"  alt="I'm so Sorry"/>
			<div class="mt-3">${msg}</div>
		</div>`;
    },
    getEmptyPlaceholder: function (msg) {
        return `<div class="d-flex flex-column justify-content-center align-items-center w-100 h-100">
			<i class="fas fa-frown-open" style="font-size: 3rem"></i>
			<div class="mt-3">${msg}</div>
		</div>`;
    },
    getLoaderLoading: function (msg) {
        msg = msg || '로딩중입니다<br>잠시만 기다려주십시오';

        return `<div class="text-center d-flex flex-direction-column">
			<div class="dot-spin mt-4" style="align-self: center;"></div>
			<div class="mt-3 pt-3 justify-content-center" style="animation: 3s randomColorPurple infinite; font-weight: 500; line-height: 1.3">
				${msg}
			</div>
		</div>`;
    },
    getLoadingContainer: function (msg) {
        msg = msg || '로딩중입니다<br>잠시만 기다려주십시오';

        return `<div class="loading-container">
			<div class="dot-spin mt-2" style="align-self: center;"></div>
			<div class="mt-3 pt-3 loading-msg">
				${msg}
			</div>
		</div>`;
    },
    ajaxError: function (error) {
        if (error.status === '403') {
            // 새로고침
            Alert.warning({text: '일시적인 오류가 발생하였습니다. 페이지가 다시 로딩됩니다.'}, function () {
                location.reload();
            });
        }
    },
    /**
     *
     * @param {Tabulator.Row} row
     * @param {string} modalID Modal명
     * @param options
     * @param {"mod"} options.type
     * @param {boolean} options.rowActive
     */
    showRowDetail: function (row, modalID, options) {
        options = Object.assign({}, {
            type: 'mod',
            rowActive: true
        }, options);

        ParamManager.show(modalID, options.type, row.getData());

        if (options.rowActive) {
            row.select && row.select();
        }
    }
}

/**
 * @Group Bootstrap Modal
 * @Desc Param 관리 객체
 * - Modal 생성시 Param으로 넘겨주는 input 태그 생성
 */
const ParamManager = {
    load: function (action, value) {
        const input = $(document.createElement('input'));

        let params = {};
        params.type = 'hidden';
        params.name = 'item';
        params['class'] = 'param';
        params.action = action;
        params.value = value === undefined ? null : value;

        input.attr(params);
        return input;
    },
    show: function (modalID, action, params) {
        const urlHash = {
            'jobModal': '/modal/job',
        }

        let url = urlHash[modalID] || '/modal/' + modalID;

        // modalID = modalID.replace('Modal', '')
        const obj = $(`#${modalID}Modal`);

        AjaxUtil.request({
            method: 'GET',
            url: url,
            async: false,
            success: function (data) {
                obj.html(data);
            }
        });
        obj.append(ParamManager.load(action, JSON.stringify(params)));
        obj.modal('show');
    }
}

const Toast = {
    obj: null,
    params: {},
    load: function (params) {
        this.obj = $('#toast');
        this.params = params;

        this.draw();
    },
    draw: function () {
        const obj = this.obj;
        const params = this.params;

        const msgObj = obj.find('.toast-body');
        const iconObj = obj.find('.toast-icon > i');

        const iconHash = {
            'heart': 'fa-heart',
            'star': 'fa-star'
        };

        // 기본 아이콘
        let icon = 'fa-circle-exclamation';
        if (params.iconType && Object.keys(iconHash).includes(params.iconType)) {
            icon = iconHash[params.iconType];
        }
        const options = {
            delay: params.delay || 3000,
            message: params.message || params.msg || ''
        }

        msgObj.html(options.message);
        iconObj.attr('class', `fas ${icon}`);

        obj.toast('show');
        setTimeout(function () {
            obj.toast('hide');
        }, options.delay);
    }
}

/**
 * Bootstrap Notify
 * @param icon
 * @param type
 * @param message
 * @param timer
 */
const Notify = {
    load: function (params) {
        let icon = params.icon || 'fa-exclamation-circle';
        let type = params.type || 'info';
        let message = params.message || '테스트';
        let timer = params.timer || 30;
        let event = params.event || function () {
        }

        $.notify({
            icon: `fas ${icon}`,
            message: message
        }, {
            type: type,
            animate: {
                enter: "animate__animated animate__fadeInDown",
                exit: "animate__animated animate__fadeOutRight"
            },
            timer: timer,
            placement: {
                from: 'top',
                align: 'right'
            }
        });

        event();
    }
}

/**
 * @Group SweetAlert2
 * @Desc 알림창 관리 객체
 *
 * 1. Alert.load(params, onHide);
 * @param params: object {type, icon, title, text}
 *    - type: string [ info | success | warning | error | danger ]
 *  - icon: string [ info | success | warning | error ]
 *  - title: string, text: string
 * @param onHide: callback function (to perform after modal is closed)
 *   syntax => (result) => {}
 *   result: object {isConfirmed: boolean, isDenied: boolean, isDismissed: boolean, value: boolean}
 *
 * 2. Alert.find(type, params, onHide)
 * - find function using type
 * - type: string [ info | success | warning | error | danger ]
 *
 * 3. Alert.info(params, onHide)
 * 4. Alert.warning(params, onHide)
 * 5. Alert.success(params, onHide)
 * 6. Alert.danger(params, onHide)
 * 7. Alert.error(params, onHide)
 *
 * 8. Alert.confirm(params, onHide, time);
 * - params: object {title, text, confirmText, cancelText}
 *   title: string, text: string, confirmText: string, cancelText: string
 * - time: int - timeout seconds
 */
const Alert = {
    params: {},
    load: function (params, onHide) {
        this.params = params;

        Alert.draw(params, onHide);
    },
    find: function (type, params, onHide) {
        const alert_type = {
            info: this.info,
            warning: this.warning,
            success: this.success,
            danger: this.danger,
            error: this.danger
        }

        let func = this.info;
        if (Object.keys(alert_type).includes(type)) {
            func = alert_type[type];
        }

        func(params, onHide);
    },
    /**
     * [Alert]
     * @param params
     * @param onHide
     */
    info: function (params, onHide) {
        params.type = 'info';
        params.icon = 'info';

        Alert.draw(params, onHide);
    },
    warning: function (params, onHide) {
        params.type = 'warning';
        params.icon = 'warning';

        Alert.draw(params, onHide);
    },
    success: function (params, onHide) {
        params.type = 'success';
        params.icon = 'success';

        Alert.draw(params, onHide);
    },
    danger: function (params, onHide) {
        params.title = '에러 발생!';
        params.type = 'danger';
        params.icon = 'error';

        Alert.draw(params, onHide);
    },
    error: function (params, onHide) {
        params.type = 'danger';
        params.icon = 'error';

        Alert.draw(params, onHide);
    },
    /**
     * [Alert] 알림창 그리기
     * @param params
     * @param {'error'|'success'|'warning'|'info'} params.icon 아이콘 유형
     * @param {string} params.title 알림창 제목
     * @param {string} params.text 알림창 내용
     * @param {'danger'|'success'|'warning'|'info'} params.type 버튼 유형
     * @param {number} params.time 알림창 닫힘 시간
     * @param {boolean} params.timeDisplay 알림창 닫힘 시간 표시여부
     * @param {function} onHide 알림창 닫힐때 callback
     */
    draw: function (params, onHide) {
        let icon = '';
        let title = '';
        let text = '';
        let btnClass = '';

        if (params.type !== undefined) {
            icon = params.icon;
            title = params.title || '알림';
            text = params.text;
            btnClass = params.type;
        } else {
            icon = 'error';
            title = '알수 없음!';
            btnClass = 'danger';
        }
        if (onHide === undefined) {
            onHide = () => {
            };
        }

        let timerInterval;
        let time = params.time || 100
        let timeContext = '';
        if (params.time !== undefined && params.timeDisplay !== undefined && params.timeDisplay) {
            timeContext = `<br>[ <strong>${params.time}</strong>초 내로 팝업이 종료됩니다. ]`;
        }

        Swal.fire({
            icon: icon,
            title: title,
            html: text + timeContext,
            timer: time * 1000,
            willOpen: () => {
                if (params.time != undefined) {
                    timerInterval = setInterval(() => {
                        const section = Swal.getContent().querySelector('strong');
                        if (section != null) {
                            section.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                        }
                    }, 1000);
                }
            },
            willClose: () => {
                if (params.time != undefined) {
                    clearInterval(timerInterval);
                }
            },
            customClass: {
                confirmButton: `btn btn-${btnClass}`,
                cancelButton: 'btn btn-secondary'
            },
        }).then(onHide);
    },
    /**
     * [Alert] 확인 알림창
     * @param params
     * @param {string} params.title 알림창 제목
     * @param {string} params.text 알림창 내용
     * @param {string} params.confirmText 확인 버튼
     * @param {string} params.cancelText 취소 버튼
     * @param {string} params.icon 아이콘
     * @param {number} params.time 알림창 지속 시간
     * @param {function} onHide 알림창 닫힐때 callback
     */
    confirm: function (params, onHide) {
        let title = '정말로 삭제하시겠습니까?';
        let text = '삭제 시 복구가 불가능합니다.';

        let confirmButtonText = '예';
        let cancelButtonText = '아니오';
        let icon = 'info';
        let time = params.time;

        // param setting
        if (params !== undefined) {
            title = params.title || '알림';
            text = params.text;
            confirmButtonText = params.confirmText || '예';
            cancelButtonText = params.cancelText || '아니오';
            icon = params.icon || 'info';
        }

        // onHide setting
        if (onHide === undefined) onHide = () => {
        };

        // timeout setting
        if (time === undefined) time = false;
        else time *= 1000;

        let timerInterval;

        Swal.fire({
            title: title,
            html: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            customClass: {
                confirmButton: 'btn btn-info',
                cancelButton: 'btn btn-secondary'
            },
            timer: time,
            willOpen: () => {
                if (time !== false) {
                    timerInterval = setInterval(() => {
                        const strong = Swal.getContent().querySelector('strong');
                        if (strong != null) {
                            strong.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                        }
                    }, 1000);
                }
            },
            willClose: () => {
                if (time !== false) {
                    clearInterval(timerInterval);
                }
            }
        }).then(onHide);
    },
    printLoading: function (params) {
        let text = params.text || '데이터를 출력 중입니다.<br>잠시만 기다려주십시오!';
        Swal.fire({
            html: TableUtil.getLoaderLoading(text),
            width: '25rem',
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
            backdrop: 'rgba(0, 0, 0, 0.6)'
        });
    }
};

/**
 * @Group AJAX
 * @Desc Ajax 공통 유틸
 * @type {{request: AjaxUtil.request, requestBody: (function({url: string, async: boolean, file: boolean, method: ("GET"|"POST"), table: string, modal: Modal, success: Function, fail: Function, error: Function, complete: Function, successMessage: string, failMessage: string, alert: boolean}, {enable: boolean, obj: jQuery}=): Promise<{} | {}>), errorHandling: ((function(*, *): boolean)|*)}}
 */
const AjaxUtil = {
    /**
     * [AjaxUtil] Ajax 요청
     * @param params Ajax 요청 파라미터
     * @param {string} params.url Ajax URL
     * @param {boolean} params.async 비동기 여부
     * @param {'GET'|'POST'} params.method method type
     * @param {string} params.table Tabulator ID
     * @param {Modal} params.modal jQuery Modal 객체
     * @param {function} params.success success callback
     * @param {function} params.fail fail callback
     * @param {function} params.error error callback
     * @param {function} params.complete complete callback
     * @param {string} params.successMessage success 자동화 - 성공시 메시지
     * @param {string} params.failMessage success 자동화 - 실패시 메시지
     * @param {boolean} params.alert
     *
     * @param loadingOptions Ajax 요청시 Loading 정보
     * @param {boolean} loadingOptions.enable Ajax 요청시 Loading 보여주기 유무
     * @param {jQuery} loadingOptions.obj Loading 보여줄 객체
     */
    request: function (params, loadingOptions) {
        const that = this;
        const url = params.url;
        const async = params.async && true;

        const defaultParams = {path: location.pathname};

        const data = Object.assign({}, defaultParams, params.data) || defaultParams;
        const method = params.method || 'POST';
        let table = params.table || '';
        const modal = params.modal;
        const alert = params.alert && true;
        const file = params.file || false;

        const successMessage = params.successMessage || '';
        const failMessage = params.failMessage || '';

        // Callback function
        const done = params.success || function (data, that) {
            // console.info(that.url, data);
            let code = data.code;
            let msg = data.desc;

            if (table !== '') {
                table = Tabulator.findTable(`#${table}`)
            }
            if (code / 100 === 2) {
                if (successMessage !== '') {
                    msg = successMessage;
                }
                if (code === 210) {
                    if (failMessage !== '') {
                        msg = failMessage;
                    }
                }

                /**
                 * 알림 옵션
                 * @type {[{textTime: boolean, text: *, title: string},((function(): void)|*)]}
                 */
                const options = [{title: '알림', text: msg, textTime: true}, function () {
                    if (table !== '') {

                        if (url.includes('del')) {
                            table[0].setData();
                        } else {
                            table[0].replaceData();
                        }
                        if (modal !== undefined) modal.modal('hide');
                    } else {
                        location.reload();
                    }
                }];

                if (code === 210) {
                    Alert.warning(...options);
                } else {
                    Alert.success(...options);
                }
            } else {
                if (failMessage !== '') {
                    msg = failMessage;
                }
                Alert.warning({title: '알림', text: msg, textTime: true}, function () {
                    if (table !== '') {
                        table[0].replaceData();
                    } else {
                        location.reload();
                    }
                });
            }
        };
        const fail = params.error || function (xhr, status, errorThrown) {
            // _csrf Error
            if (xhr.status === '403') {
                // 새로고침
                Alert.warning({text: '일시적인 오류가 발생하였습니다. 페이지가 다시 로딩됩니다.'}, function () {
                    location.reload();
                });
            }
            // Unhandled Error
            else {
                Alert.danger({text: '오류가 발생하였습니다. 관리자에게 문의해주시기 바랍니다.'});
                console.error(`오류명: ${errorThrown}, 상태: ${status}`);
            }

        }
        const always = params.complete || function (data) {
        };

        let options = {
            type: method,
            url: url,
            data: data,
            async: async,
            beforeSend: function (xhr) {
                const token = $("meta[name='_csrf']");
                if (token.length !== 0) {
                    value = token.attr("content");
                    const header = $("meta[name='_csrf_header']").attr("content");

                    xhr.setRequestHeader(header, value);
                }

                if (loadingOptions && loadingOptions.enable === true) {
                    LoadingUtil.init(loadingOptions.obj)
                }
            }
        };

        if (file) {
            options = Object.assign({}, {
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
            }, options);
        }

        $.ajax(options)
            .done(function (data) {
                that.errorHandling(data, alert);

                done(data, this);
            })
            .fail(fail)
            .always(always);
    },
    /**
     * [AjaxUtil] Ajax 요청
     * @param params Ajax 요청 파라미터
     * @param {string} params.url Ajax URL
     * @param {boolean} params.async 비동기 여부
     * @param {boolean} params.file 파일추가 여부
     * @param {'GET'|'POST'} params.method method type
     * @param {string} params.table Tabulator ID
     * @param {Modal} params.modal jQuery Modal 객체
     * @param {function} params.success success callback
     * @param {function} params.fail fail callback
     * @param {function} params.error error callback
     * @param {function} params.complete complete callback
     * @param {string} params.successMessage success 자동화 - 성공시 메시지
     * @param {string} params.failMessage success 자동화 - 실패시 메시지
     * @param {boolean} params.alert
     *
     * @param loadingOptions Ajax 요청시 Loading 정보
     * @param {boolean} loadingOptions.enable Ajax 요청시 Loading 보여주기 유무
     * @param {jQuery} loadingOptions.obj Loading 보여줄 객체
     * @returns {Promise<{}>}
     */
    requestBody: function (params, loadingOptions = {}) {
        const that = this;
        const url = params.url;
        const async = params.async && true;

        const defaultParams = {path: location.pathname};

        const data = Object.assign({}, defaultParams, params.data) || defaultParams;
        const method = params.method || 'POST';
        let table = params.table || '';
        const modal = params.modal;
        const alert = params.alert && true;
        const file = params.file && true;

        const successMessage = params.successMessage || '';
        const failMessage = params.failMessage || '';

        // Callback function
        const done = params.success || function (data, that) {
            let code = data.code;
            let msg = data.desc;

            if (table !== '') {
                table = Tabulator.findTable(`#${table}`)
            }
            if (code / 100 === 2) {
                if (successMessage !== '') {
                    msg = successMessage;
                }
                if (code === 210) {
                    if (failMessage !== '') {
                        msg = failMessage;
                    }
                }

                /**
                 * 알림 옵션
                 * @type {[{textTime: boolean, text: *, title: string},((function(): void)|*)]}
                 */
                const options = [{title: '알림', text: msg, textTime: true}, function () {
                    if (table !== '') {
                        let tableFirst = table[0];
                        if (tableFirst.options.paginationMode && tableFirst.options.paginationMode === 'remote') {
                            const page = tableFirst.getPage();
                            tableFirst.setPage(page);
                        } else if (url.includes('add')) {
                            tableFirst.setData();
                        } else {
                            tableFirst.replaceData();
                        }
                        if (modal !== undefined) modal.modal('hide');
                    } else {
                        location.reload();
                    }
                }];

                if (code === 210) {
                    Alert.warning(...options);
                } else {
                    Alert.success(...options);
                }
            } else {
                if (failMessage !== '') {
                    msg = failMessage;
                }
                Alert.warning({title: '알림', text: msg, textTime: true}, function () {
                    if (table !== '') {
                        table[0].replaceData();
                    } else {
                        location.reload();
                    }
                });
            }
        };

        const fail = params.error || function (xhr, status, errorThrown) {
            // _csrf Error
            if (xhr.status === '403') {
                // 새로고침
                Alert.warning({text: '일시적인 오류가 발생하였습니다. 페이지가 다시 로딩됩니다.'}, function () {
                    location.reload();
                });
            }
            // Unhandled Error
            else {
                Alert.danger({text: '오류가 발생하였습니다. 관리자에게 문의해주시기 바랍니다.'});
                console.error(`오류명: ${errorThrown}, 상태: ${status}`);
            }

        }
        const token = $('#_csrf').attr('content');
        const header = $('#_csrf_header').attr('content');

        const always = params.complete || function (data) {
        };

        let headers = {};
        let body = data;


        if (!file) {
            headers = {
                'Content-Type': 'application/json'
            }
            headers[token] = header;
            body = JSON.stringify(data);
        }

        const option = {
            method: 'POST',
            body: body
        };

        if (!file) {
            option.headers = headers;
        }

        if (loadingOptions && loadingOptions.enable === true) {
            loadingOptions.obj.html(TableUtil.getLoaderLoading(' '));
        }

        let result = {};
        return fetch(url, option)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (!that.errorHandling(data, alert)) {
                    done(data);
                }

                result = data;
            })
            .catch(error => {
                console.error('error', error);
            })
            .finally(_ => {
                always();
            })
            .then(() => {
                return result;
            })
    },
    /**
     * [AjaxUtil] Error 처리기
     * @param data 응답 결과
     * @param alert 알림창 여부
     * @returns {boolean} 처리 결과 - 예외 처리됨 (true), 예외 없음(false)
     */
    errorHandling: function (data, alert) {
        alert = alert === undefined ? true : alert;

        const code = data.code || 200;
        const desc = data.desc || "처리중 오류가 발생하였습니다.";
        const codeList = [410, 421];

        // 예외처리하는 오류가 아닐 경우
        if (!codeList.includes(code)) {
            return false;
        }

        // 알림 기능을 이용하지 않을 경우
        else if (alert === false) {
            return true;
        }

        // 필수 파라미터 누락
        if (code === 410) {
            Alert.error({text: desc});
        }
        // 로그인 세션 정보가 없을경우
        else if (code === 421) {
            Alert.error({text: desc}, () => {
                sessionStorage.device = '';
                location.href = '/admin/logout';
            });

            return true;
        }

        return false;
    }
}

/**
 * @Group Util
 * @Desc Date Format
 * @param type - object, day, month, year, time, timenon
 * @param params {day, month, year, hour, minute, second}
 * @type {{getSlot: ((function(*, *): string)|*), getDateToStr: ((function(*, *): (*))|*)}}
 */
const DateUtil = {
    /**
     * [DateUtil] Date 날짜 구하기
     * @param {'object'|'day'|'month'|'year'|'timestamp'} type 반환 타입
     * @param params
     * @param {number} params.year 년
     * @param {number} params.month 월
     * @param {number} params.day 일
     * @param {number} params.hour 시
     * @param {number} params.minutes 분
     * @param {number} params.seconds 초
     * @returns {*|string}
     */
    getDateToStr: function (type, params) {
        let date = new Date();
        params = params || {};

        let day = params.day || 0;
        let month = params.month || 0;
        let year = params.year || 0;
        let hour = params.hour || 0;
        let minutes = params.minutes || 0;
        let seconds = params.seconds || 0;

        date.setDate(date.getDate() + day);
        date.setMonth(date.getMonth() + month);
        date.setFullYear(date.getFullYear() + year);
        date.setHours(date.getHours() + hour);
        date.setMinutes(date.getMinutes() + minutes);
        date.setSeconds(date.getSeconds() + seconds);

        year = date.getFullYear();
        month = Utils.leftPad(date.getMonth() + 1);
        day = Utils.leftPad(date.getDate());
        hour = Utils.leftPad(date.getHours());
        minutes = Utils.leftPad(date.getMinutes());
        seconds = Utils.leftPad(date.getSeconds());

        const valHash = {
            object: date,
            day: [year, month, day].join('-'),
            month: [year, month].join('-'),
            year: year,
            timestamp: [year, month, day].join('-') + ' ' + [hour, minutes, seconds].join(':'),
            timenon: [year, month, day, hour, minutes, seconds].join(''),
        }

        if (Object.keys(valHash).includes(type)) {
            return valHash[type];
        }

        return valHash.day;
    },

    getSlot: function (num, nm_flag) {
        if (nm_flag === false) {
            return `${num}-${num + 1}`;
        }
        return `${num}-${num + 1}시`;
    }
};

/**
 * @Group Util
 * @Desc Validation Check
 */
const ValidationUtil = {
    /**
     * [ValidationUtil] 비밀번호 패턴 체크 (8자 이상, 문자, 숫자, 특수문자 포함여부 체크)
     * @param {string} str 검사할 값
     * @returns {{result: boolean, error: string}}
     */
    checkPasswordPattern: function (str) {
        let pattern1 = /[0-9]/; // 숫자
        let pattern2 = /[a-zA-Z]/; // 문자
        let pattern3 = /[.~!@#$%^&*()_+|<>?:{}]/; // 특수문자

        return {
            result: !(!pattern1.test(str) || !pattern2.test(str) || !pattern3.test(str) || str.length < 8 || str.length > 20),
            error: '비밀번호는 문자, 숫자, 특수문자 포함<br>8자 이상 20자이내로 사용 가능합니다.'
        };
    },
    /**
     * [ValidationUtil] 아이디 패턴 체크 (5~20자, 알파벳 소문자, 숫자, '_', '-' 체크)
     * @param {string} str 검사할 값
     * @returns {{result: boolean, error: string}} 유효성
     */
    checkIdPattern: function (str) {
        // 5~20자 알파벳 소문자, 숫자, 특수문자(_),(-) 허용
        return {
            result: /^[a-z0-9\_\-]{5,20}$/.test(str),
            error: '아이디는 5~20자 이내로, 영문 소문자, 숫자, 특수문자(-,_)만 사용가능합니다.'
        };
    },
    /**
     * [ValidationUtil] letter 패턴 체크 (2~20자, 알파벳 소문자, 숫자, '_', '-' 체크)
     * @param {string} str 검사할 값
     * @returns {{result: boolean, error: string}} 유효성
     */
    checkLetterPattern: function (str) {
        // 2~20자 알파벳 소문자, 숫자, 특수문자(_),(-) 허용
        return {
            result: /^[a-z0-9\_\-]{2,20}$/.test(str),
            error: '2~20자 이내로, 영문 소문자, 숫자, 특수문자(-,_)만 사용가능합니다.'
        };
    },
    /**
     * [ValidationUtil] 이름 패턴 체크 (특수문자 체크)
     * @param {string} str 검사할 값
     * @param {number} max 최대값
     * @returns {{result: boolean, error: string}} 유효성
     */
    checkSpecialPattern: (str, max = 20) => {
        let pattern = /([`~!@#$%^&*(),.\_\-\+\=\|\\\[\]\{\}\<\>\/\?])/;
        return {
            result: !(pattern.test(str) || str.length < 2 || str.length > max),
            error: `2~${max}자 이내로, 특수 문자를 제외하고 사용가능합니다.`
        };
    },
    /**
     * [ValidationUtil] 이메일 검증
     * @param {string} email 검사할 이메일 값
     * @returns {{result: boolean, error: string}} 결과
     */
    checkEmail: (email) => {
        let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            result: pattern.test(email),
            error: '올바른 이메일 형식을 사용해주세요.'
        };

    },
    /**
     *
     * @param {File} file 파일
     * @returns {{result: boolean, error: string}}
     */
    checkFile: function (file) {
        const maxSize = 10 * 1024 * 1024 // 10 MB
        const acceptedImageTypes = ['image/jpeg', 'image/png'];

        // 특수 문자 처리
        if (ValidationUtil.checkSpecialPattern(file.name).result) {
            return {
                result: false,
                error: '특수문자가 포함된 파일은 업로드할 수 없습니다.'
            };
        }
        // 파일 형식 처리
        else if (!acceptedImageTypes.includes(file.type)) {
            return {
                result: false,
                error: '이미지 형식의 파일만 업로드할 수 있습니다!'
            };
        }
        // 파일 크기 처리
        else if (file.size > maxSize) {
            return {
                result: false,
                error: Utils.calcByteSize(maxSize) + ' 이상의 파일은 업로드할 수 없습니다!'
            };
        }

        return {
            result: true,
            error: ''
        };
    },
}

/**
 * @Group Common
 * Array Display Util
 */
const ArrUtil = {
    /**
     * [ArrUtil] Array 로 배지 생성
     * @param {Array} arr Badge 를 생성할 목록
     * @param {string} bgClass Badge Background Class
     * @returns {*|string}
     */
    createStrBadgeWithArr: function (arr, bgClass) {
        if (bgClass === undefined) bg = 'bg-info';
        const createBadge = e => `<span class="badge rounded-pill ${bgClass}">${e}</span>`;

        if (arr.length === 0) return createBadge('None');

        return arr.map(e => createBadge(e)).join(' ');
    },
    /**
     * [ArrUtil] Array 로 Input 생성
     * @param {Array} arr Badge 를 생성할 목록
     * @param {*} index number
     * @param {boolean} required 필수파라미터 여부
     * @returns {*|string}
     */
    createInputWithArr: function (arr, index, required) {
        if (arr.length === 0) return '';

        let additional = ''
        if (required) {
            additional += '<span class="required">*</span>';
        }

        return arr.map(function (e) {
            const id = e + index;
            let inputBox = `<input type="text" id="${id}"name="${e}" class="form-control" />`;

            return `<div class="row mb-1">
				<div class="col-sm-3"><label class="col-form-label" for="${id}">${additional}${e}</label></div>
				<div class="col-sm-9">${inputBox}</div>
			</div>`;
        }).join(' ');
    }
};

/**
 * [LoadingUtil] Loading 관리자
 * @type {{init: ((function(*): (boolean))|*)}}
 */
const LoadingUtil = {
    init: function (container) {
        if (container.length) {
            container.append(TableUtil.getLoadingContainer(' '));
            container.off();
            return true;
        }
        return false;
    },
    destroy: function (container) {
        container.find('.loading-container').remove();
    }
}

const IconUtil = {
    enable: '<i class="text-success fas fa-check"></i>',
    disable: '<i class="text-danger fas fa-times"></i>',
    success: '<i class="status-1 status-title fas fa-circle"></i>',
    fail: '<i class="status-0 status-title fas fa-circle"></i>'
}

// field 유효성 검사 모음
const ValidateField = {

    // formData 인자로 받은 field에 대해 유효성 검사 함수
    valid: function (formData) {
        for (const field in formData) {
            console.log(field)
            const value = document.getElementById(field).value;
            // 'birth' 유효성 확인
            if(field === 'birth'){
                var result = this.checkValidDate(value);
                if(result == false) {
                    Alert.warning({text: `${formData[field]}을 정확히 입력해 주세요.`}) // 생년월일을 정확히 입력해 주세요.
                    return false;
                }
            }
            // 'email' 유효성 확인
            if(field === 'email'){
                var result = this.checkValidEmail(value);
                if(result == false) {
                    Alert.warning({text: `${formData[field]}을 정확히 입력해 주세요.`}) // 이메일을 정확히 입력해 주세요.
                    return false;
                }
            }
            // 이외의 값 확인
            if(!value || value === '<p>&nbsp;</p>'){
                Alert.warning({text: `${formData[field]}을 입력해 주세요.`})
                return false
            }
        }
        return true;
    },

    // str 인자로 받은 관리자 id에 대한 유효성 검사 함수
    verify: function (str) {
        return (str.length >= 4 && str.length <= 12) && (/^[A-Za-z0-9][A-Za-z0-9]*$/.test(str)) && (/^[A-Za-z]*$/.test(str.slice(0, 1)))
    },

    // 날짜 유효성 검사 함수 (윤년 포함)
    checkValidDate: function (value) {
        var result = true;
        try {
            var date = value.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3').split("-");
            var y = parseInt(date[0], 10),
                m = parseInt(date[1], 10),
                d = parseInt(date[2], 10);
            var dateRegex = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
            result = dateRegex.test(d+'-'+m+'-'+y);
        } catch (err) {
            result = false;
        }
        return result;
    },

    // 이메일 유효성 검사 함수
    checkValidEmail: function (value) {
        const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
        var result = pattern.test(value);
        return pattern.test(value);
    }
}
