$(function () {
    const Content = {
        params: {}, load: function (params) {
            this.params = params;
            this.draw();
        }, draw: function () {
            BookStats.load();
            RoomStats.load();

            $('*[role="action"][data-action="refresh"]').click(function (e) {
                const card = this.dataset.card;
                if (card === 'roomStats') {
                    RoomStats.load();
                } else if (card === 'bookStats') {
                    BookStats.load();
                }
            })
        }
    };

    const BookStats = {
        container: $('.card[data-card="bookStats"]'), result: {}, load: function () {
            const that = this;
            const container = this.container;

            LoadingUtil.init(container);
            AjaxUtil.request({
                url: '/api/stats/book', success: function (data) {
                    if (data.code === 200) {
                        that.result = data.result;
                        that.draw();
                    }
                }
            });
        }, draw: function () {
            const container = this.container;
            const result = this.result;

            LoadingUtil.destroy(container);
            Object.keys(result).forEach(key => {
                Animation.number(container.find(`span[role="data"][data-target="${key}"]`), result[key]);
            })
        }
    };

    const RoomStats = {
        container: $('.card[data-card="roomStats"]'), result: {}, load: function () {
            const that = this;
            const container = this.container;

            LoadingUtil.init(container);
            AjaxUtil.request({
                url: '/api/stats/room', success: function (data) {
                    that.result = data.result;
                    that.draw();
                }
            });
        }, draw: function () {
            const that = this;
            const container = this.container;
            const result = this.result;

            LoadingUtil.destroy(container);

            const table = container.find('#roomBody');
            table.html('');

            const items = result.items || [];
            items.forEach(item => {
                table.append(that.createTr(item))
            })
        }, createTr: function (item) {
            const room = item.room;
            return `<tr>
                        <td>
                            <div class="d-flex px-2 py-1">
                                <div>
                                    <img src="/api/room/image?key=${room.key}" class="avatar avatar-md me-3" alt="table image"
                                        onerror="this.onerror = null; this.src = '/static/images/common/forbidden.png'">
                                </div>
                                <div class="d-flex flex-column justify-content-center">
                                    <h6 class="mb-0 text-lg">${room.value}</h6>
                                </div>
                            </div>
                        </td>
                        <td class="text-sm">${room.floor ? room.floor + '층' : '<span class="opacity-5">미입력</span>'}</td>
                        <td><b>${item.bookCount}</b>권</td>
                        <td><b>${item.antennaCount}</b>개</td>
                        <td><b>${item.shelfCount}</b>개</td>
                    </tr>`
        }
    }
    Content.load();
});