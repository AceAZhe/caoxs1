/**
 * Created by Administrator on 2018/4/12.
 */

// 1.轮播图
function  carouselFigure(oDiv,oUl,oLi) {
    var sWidth = $(oLi).width();  //获取焦点图li的宽度（显示面积）
    var len = $(oLi).length;      //获取焦点图li个数
    var index = 0;               //定义初始ul位置
    var picTimer;               //定义初始定时器

    $(oUl).css("width",sWidth * (len)+(len+1)*30);    //动态设置ul的宽度


    //鼠标滑上焦点图时停止自动播放，滑出时开始自动播放
    $(oDiv).on('touchstart',function () {
        clearInterval(picTimer);
    });
    $(oDiv).on('touchend',function (e) {
        picTimer = setInterval(function() {
            showPics(index);
            index++;
            if (index == len) {
                index = 0;
            }
        }, 1000); //此5000代表自动播放的间隔，单位：毫秒
    });

    // $(oDiv).hover(function() {
    //     clearInterval(picTimer);
    // }, function() {
    //     picTimer = setInterval(function() {
    //         showPics(index);
    //         index++;
    //         if (index == len) {
    //             index = 0;
    //         }
    //     }, 1000); //此5000代表自动播放的间隔，单位：毫秒
    // }).trigger("touchend");

    //显示图片函数，根据接收的index值显示相应的内容
    function showPics(index) {            //普通切换
        var nowLeft = -index * sWidth;    //根据index值计算ul元素的left值
        // $(oUl).stop(true, false).animate({
        //     "left" : nowLeft
        // }, 1000,"linear"); //通过animate()调整ul元素滚动到计算出的
        $(oUl).css({"transform":"translate("+nowLeft+")"})

    }
};

//2.H5分层适配
function isIphoneX() {
    return screen.height == 812 && screen.width == 375
}

function is1366_768() {
    return screen.height == 768 && screen.width == 1366
}

function is1024_768() {
    return screen.height == 768 && screen.width == 1024
}

function is1600_900() {
    return screen.height == 900 && screen.width == 1600
}

function isHengPing() {
    return window.innerWidth > window.innerHeight
}

//0.本adapter.js函数是基于移动端分层（3层）完美适配。内容和背景分离；
function adapter(width, height, callback) {   //width,height为ui图纸的宽高
    //1.返回窗口的文档显示区的宽、高度。
    var ww = window.innerWidth
    var wh = window.innerHeight
    //2.设置html页面html,body,最外层容器，内层外容器的宽高为窗口文档的宽高
    $('html, body, .container, .page, .section,  .scroll-view-x, .scroll-view-y').css({
        width: ww + 'px',
        height: wh + 'px'
    })
    //3.设置分层适配内容和背景的大小为ui图纸的大小（通常i6图纸750*1206）
    $('.page-canvas, .bg, .content').css({
        width: width + 'px',
        height: height + 'px'
    })

    var bjZoom = Math.max(ww / width, wh / height)        //div class="bg"
    var contentZoom = Math.min(ww / width, wh / height)   //div class="content"

    if (isIphoneX()) {
        $('.nextPage-btn').css({
            right: '55px'
        })
    }

    // if (is1024_768() || is1366_768() || is1600_900() || isIphoneX() || isHengPing()) {
    //   bjZoom = contentZoom
    // }

    var x1 = ((ww - width * bjZoom) / 2).toFixed(2)    //width*height比例的ui图纸在设备ww*wh宽高下图纸缩放bjZoom后x留白
    var y1 = ((wh - height * bjZoom) / 2).toFixed(2)

    var x2 = ((ww - width * contentZoom) / 2).toFixed(2)
    var y2 = ((wh - height * contentZoom) / 2).toFixed(2)

    $('.bg').css({
        transform: 'translate(' + x1 + 'px, ' + y1 + 'px) scale(' + bjZoom + ')',
        '-webkit-transform': 'translate(' + x1 + 'px, ' + y1 + 'px) scale(' + bjZoom + ')',
        width: width + 'px',
        height: height + 'px'
    })

    $('.content').css({
        transform: 'translate(' + x2 + 'px, ' + y2 + 'px) scale(' + contentZoom + ')',
        '-webkit-transform': 'translate(' + x2 + 'px, ' + y2 + 'px) scale(' + contentZoom + ')',
        width: width + 'px',
        height: height + 'px'
    })

    // 宽度缩放
    var zoomWidth = ww / width

    $('.scroll-view-y').css({
        transform: 'scale(' + zoomWidth + ')',
        '-webkit-transform': 'scale(' + zoomWidth + ')',
        width: ww / zoomWidth + 'px',
        height: wh / zoomWidth + 'px'
    })

    // 高度缩放
    var zoomHeight = wh / height
    $('.scroll-view-x').css({
        transform: 'scale(' + zoomHeight + ')',
        '-webkit-transform': 'scale(' + zoomHeight + ')',
        width: ww / zoomHeight + 'px',
        height: wh / zoomHeight + 'px'
    })

    // 自定义缩放
    $('.zoomWidth').css({
        zoom: zoomWidth
    })

    // 适配成功后的回调
    if (typeof callback == 'function') {
        callback()
    }
}