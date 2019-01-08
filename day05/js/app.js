/**
 * Created by Administrator on 2018/11/7.
 */
/*
 * 功能说明:
 1. 点击向右(左)的图标, 平滑切换到下(上)一页
 2. 无限循环切换: 第一页的上一页为最后页, 最后一页的下一页是第一页
 3. 每隔3s自动滑动到下一页
 4. 当鼠标进入图片区域时, 自动切换停止, 当鼠标离开后,又开始自动切换
 5. 切换页面时, 下面的圆点也同步更新
 6. 点击圆点图标切换到对应的页

 bug : 快速点击时，翻页不正常 （无论快速点击多少次，只要在翻页中，此时点击不生效）

 * */
$(function () {
    //获取元素
    var $container = $('#container');
    var $list = $('#list');
    var $span = $('#pointsDiv>span');
    var $prev = $('#prev');
    var $next = $('#next');
    //第二个定时器，用来开启自动轮播
    var timer2 = null;
    //页面的宽度
    var pageWidth = $('#container').width();
    //总时间
    var allTime = 300;
    //每一步的时间
    var everyTime = 20;
    //小圆点之前的索引下标，
    var oldindex = 0;
    //设置isMove
    var isMove = false;

    //1. 点击向右(左)的图标, 平滑切换到下(上)一页
    //切换到下一页
    $next.click(function () {
        animate(true);
    });
    //切换到上一页
    $prev.click(function () {
        animate(false);
    });

    // 3. 每隔3s自动滑动到下一页
    // auto();
    function auto() {
        timer2 = setInterval(function () {
            animate(true)
        }, 1000)
    }

    // 4. 当鼠标进入图片区域时, 自动切换停止, 当鼠标离开后,又开始自动切换
    $container
        .mouseenter(function () {
            clearInterval(timer2)
        }).mouseleave(function () {
        // auto();
    });

    //6. 点击圆点图标切换到对应的页
    $span.click(function () {
        //点击的小圆点的索引下标
        var clickIndex = $(this).index();

        animate(clickIndex);

    });

    //切换页面的逻辑
    function animate(next) { //next是形参
        if (isMove) {
            return;
        }
        //next 的值为true ，页面切换到下一页

        //检测当前传入的next的类型
        //当前next是布尔值，offset = next ? -pageWidth : pageWidth
        //如果next是number值，offset = (点击的索引值 - 之前的索引值) * 600

        //判断移动的距离
        // var offset = next ? -pageWidth : pageWidth;
        var offset = 0;
        if (typeof next === 'boolean') {
            offset = next ? -pageWidth : pageWidth;
        } else {
            offset = -(next - oldindex) * pageWidth;
        }
        isMove = true;
        //之前的left值  就是当前元素的位置
        var oldLeft = $list.position().left;
        //新的left值(目标位置) = 之前的left值 + 移动的距离
        var newLeft = oldLeft + offset;
        //每一步的距离 移动的距离/(总时间/每一步的时间)
        var everyOffset = offset / (allTime / everyTime);

        var timer = setInterval(function () {
            oldLeft += everyOffset;
            if (oldLeft === newLeft) {
                clearInterval(timer);
                isMove = false;
                if (oldLeft === -pageWidth * ($span.length + 1)) {
                    oldLeft = -pageWidth
                } else if (oldLeft === 0) {
                    oldLeft = -pageWidth * $span.length
                }
            }
            $list.css('left', oldLeft);
        }, everyTime);

        //5. 切换页面时, 下面的圆点也同步更新
        updateSpan(next)//这里的next是实参

    }

    //小圆点方法
    function updateSpan(bool) {
        //确认小圆点新的索引下标
        var newIndex = 0;

        if (typeof bool === 'boolean') {

            if (bool) {
                newIndex = oldindex + 1;
            } else {
                newIndex = oldindex - 1;
            }
            //小圆点的范围
            if (newIndex === $span.length) {
                newIndex = 0
            } else if (newIndex === -1) {
                newIndex = $span.length - 1
            }
        } else {
            newIndex = bool;
        }
        //之前的index元素，需要删除on
        $span.eq(oldindex).removeClass('on');
        //新的newIndex元素，需要添加on
        $span.eq(newIndex).addClass('on');

        //更新index
        oldindex = newIndex;
    }

});















