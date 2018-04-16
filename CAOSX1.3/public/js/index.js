/**
 * Created by Administrator on 2018/4/9.
 */
(function () {
    window.onload=function () {
        var n=0;     //loading页面加载时间计数
        var len=0;  //gaming页面还剩物品件数计数
        var countScores=0; //计算分数
        // 1. 定时器loading动画动画结束后主页面main显示
        var timeLoading=setInterval(function () {
            n++;
            if(n<=350) {
                $(".loading-car").eq(0).css("left", n + 150 + "px");
                $(".loading-tar-inner").eq(0).css("width", n*43/35 + "px");
                $(".loading-count").eq(0).html(parseInt(n*2/7) + "%");
            }else{
                clearTimeout(timeLoading);
                $(".loading").eq(0).addClass("hide");
                $(".main").eq(0).removeClass("hide");
            }
        },1);

        // 2.自动播放，当被单击时，会触发开关背景音乐播放,点击音乐播放
        $(".background-music").eq(0).click(function (e) {
            e.preventDefault();
            var $tar=$(e.currentTarget);
            var $Audio=$(".audio-music").eq(0);
            if($Audio.get(0) !==null){
                if($Audio.get(0).paused){
                    $Audio.get(0).play();  //注意jquery对象调用DOM的play/pause()需要加.get(0)
                    $tar.addClass("musicRotate");
                }else{
                    $Audio.get(0).pause();
                    $tar.removeClass("musicRotate");
                }
            }
        });

        // 3 点击规则按钮显示规则页面
        $(".main-rule-btn").eq(0).click(function (e) {
            e.preventDefault();
            $(".game-rule").eq(0).toggleClass("hide");
        });
        // 3.1 点击规则页面显示主页面隐藏规则页面
        $(".game-rule").eq(0).click(function (e) {
            e.preventDefault();
            $(e.target).toggleClass("hide");
        });

        // 4 点击排行榜按钮显示ranking-list页面，执行getScore函数
        $(".main-score-btn").eq(0).click(function (e) {
            e.preventDefault();
            $(".ranking-list").eq(0).toggleClass("hide");
            $(".main").eq(0).addClass("hide");
            getScore();
        });
        // 4.1 自定义函数getScore发送ajax从node的后台数据库中获取排行榜分数
        function getScore() {
            $.ajax({
                type:"get",
                url:"/score",
                success:function (data) {
                    var html="";
                    if (data.code == 1) {
                        var d = data.data;
                        var l = data.data.length;
                        for (var i = 0; i < l; i++) {
                            if (i <3) {
                                html += `<li >
                                    <img src="../public/images/lii${i + 1}.png" class="rankings-img">
                                    <img src="../public/${d[i].usrc}" class="rankings-icon">
                                    <span class="rankings-name">${d[i].uname}</span>
                                    <span class="rankings-score">${d[i].uscore}分</span>
                                </li>`;
                            } else {
                                html += `<li >
                                    <span class="scoreFonts">${i+1}</span>
                                     <img src="../public/${d[i].usrc}" class="rankings-icon">
                                    <span class="rankings-name">${d[i].uname}</span>
                                    <span class="rankings-score">${d[i].uscore}分</span>
                                </li>`;
                            }
                        }
                       $(".ranking-list-rankings").eq(0).html(html);
                    }
                },
                error:function () {
                    console.log("inde.js中发送ajax获取排行榜分数未成功")
                }
            })
        }

        //5 排行榜页面x点击关闭事件 显示主页面
        $(".ranking-list-close").eq(0).click(function () {
            $(".ranking-list").eq(0).toggleClass("hide");
            $(".main").eq(0).toggleClass("hide");
        });


        // 6 点击开始游戏触发事件
                //6.1  游戏开始背景图片.start-game-background显示，同时主页面.main隐藏
                //6.2  2秒之后游戏开始牢记物品页面.game-before显示
                //6.3  随机从40个图片中生成10个呈现在背景.game-before-background上面同时开始5秒倒计时
                //6.4  5秒倒计时结束之后显示传送带页面，开根据牢记的物品计时得分
        $(".main-game-btn").eq(0).click(function (e) {
            e.preventDefault();
            //6.1.1  游戏开始背景图片.start-game-background显示，同时主页面.main隐藏
            $(".start-game-background").eq(0).toggleClass("hide");
            $(".main").eq(0).toggleClass("hide");
            //6.2.1  2秒之后游戏开始牢记物品页面.game-before显示
            var timerGameing=setTimeout(function () {
                //6.3.1.game-before页面显示，随机从40个物品中生成10个显示在.game-before-background中，同时开始5秒倒计时
                $(".game-before").eq(0).toggleClass("hide");
                randomHandle();   //随机函数生成10个物品
                clearTimeout(timerGameing);
                var timerCount=setInterval(function () {     //5秒到倒计时用户记住物品
                    var count=$(".game-before-count").eq(0).html();
                    count--;
                    if(count>=1){
                        $(".game-before-count").eq(0).html(count);
                    }else{                          //倒计时结束后开始传送带点击游戏匹配合适的图片的界面
                        clearInterval(timerCount);
                        $(".game-before").eq(0).toggleClass("hide");
                        $(".gaming").eq(0).toggleClass("hide");
                        //传送带自动滚动
                        //传送带随机分布40个物品
                        //传送带img点击时触发事件
                        countScores=0;
                        len= arrLists.length;
                        $(".gaming-info-font").eq(0).html(len);
                        countGame();
                        $(".gaming-lists-ul").eq(0).empty();
                        getRandom();
                        $(".gaming-lists-ul").eq(0).addClass("translateM");
                        var imgs=$(".gaming-lists-ul>li>img");
                        imgs.click(function (e) {
                            e.preventDefault();
                            var tar=e.target;
                            var $tar1=$(tar).parent();
                            for(var j=0;j<arrLists.length;j++){
                                   if( tar.src==arrLists[j].src){
                                       var Img=new Image();
                                       Img.src=tar.src;
                                       Img.style.position="absolute";
                                       Img.style.width=arrLists[j].style.width;
                                       Img.style.height=arrLists[j].style.height;
                                       Img.style.left=arrLists[j].style.left;
                                       Img.style.top=arrLists[j].style.top;
                                       $(".gaming-background").eq(0).append($(Img));
                                       $tar1.empty();
                                       countScores+=500;
                                       $(".game-score-counts").eq(1).html(countScores);
                                       len--;
                                       $(".gaming-info-font").eq(0).html(len);
                                       $tar1.addClass("backgroundC");
                                        var t=setTimeout(function () {
                                            $tar1.removeClass("backgroundC");
                                           clearTimeout(t)
                                        },0)
                                   }else{
                                       $tar1.addClass("backgroundC1");
                                       var t=setTimeout(function () {
                                           $tar1.removeClass("backgroundC1");
                                           clearTimeout(t)
                                       },100)
                                   }
                            }
                        });
                    }
                },1000)
            },2000);
        });
        // 7 .传送带滚动,获取件数，时间时间计数函数,初始化gaming页面数据
        function countGame() {
            $(".gaming-background").eq(0).empty();
            if($(".gaming-lists-ul").eq(0).hasClass("translateM")){
                $(".gaming-lists-ul").eq(0).removeClass("translateM")
            }
            var x =0;
            var timer=setInterval(function () {
                x+=0.01;
                $(".gaming-info-font").eq(1).html(Math.floor(x*100)/100);
                if( $(".gaming-info-font").eq(1).html()==180 || $(".gaming-info-font").eq(0).html()=='0'){
                    clearInterval(timer);
                    $(".game-score").eq(0).toggleClass("hide");
                    $(".game-score-counts").eq(0).html( $(".gaming-info-font").eq(1).html()+"秒");
                }
            },10)
        }
        // 8.再玩一次按钮点击事件
        $(".game-score-again").eq(0).click(function (e) {
            $(".gaming-lists-ul").eq(0).empty();


            againGame(e)
        });
        // 9.得分面板X点击触发事件
        $(".game-score-background-x").eq(0).click(function (e) {
            againGame(e)
        });
        //10.自定义函数获取在来一次游戏
        function againGame(e) {
            $(".gaming-lists-ul").eq(0).empty();
            $(".game-before-count").eq(0).html(5);
            e.preventDefault();
            $(".game-score").eq(0).toggleClass("hide");
            $(".gaming").eq(0).toggleClass("hide");
            $(".start-game-background").eq(0).toggleClass("hide");
            $(".main").eq(0).toggleClass("hide");
            len=0;
        }
        //1.13随机生成10个物品
        var m=[
            {src:"images/m1.png", pos:{l:"335px",t:"236px"}},
            {src:"images/m2.png", pos:{l:"488px",t:"66px"}},
            {src:"images/m3.png", pos:{l:"72px",t:"40px"}},
            {src:"images/m4.png", pos:{l:"275px",t:"212px"}},
            {src:"images/m5.png", pos:{l:"126px",t:"144px"}},
            {src:"images/m6.png", pos:{l:"69px",t:"290px"}},
            {src:"images/m7.png", pos:{l:"297px",t:"40px"}},
            {src:"images/m8.png",pos:{l:"68px",t:"438px"}},
            {src:"images/m9.png", pos:{l:"213px",t:"395px"}},
            {src:"images/m10.png", pos:{l:"383px",t:"416px"}}
        ];
        var m_1=[
            {src:"images/m11.png", pos:{l:"328px",t:"60px"}},
            {src:"images/m21.png", pos:{l:"70px",t:"160px"}},
            {src:"images/m31.png",
                pos:{l:"88px",t:"48px"}},
            {src:"images/m41.png",
                pos:{l:"263px",t:"47px"}},
            {src:"images/m51.png",
                pos:{l:"45px",t:"323px"}},
            {src:"images/m61.png",
                pos:{l:"198px",t:"212px"}},
            {src:"images/m71.png",
                pos:{l:"470px",t:"239px"}},
            {src:"images/m81.png",
                pos:{l:"467px",t:"445px"}},
            {src:"images/m91.png",
                pos:{l:"340px",t:"310px"}},
            {src:"images/m101.png",
                pos:{l:"96px",t:"419px"}}
        ];
        var m_2=[
            {src:"images/m12.png",
                pos:{l:"68px",t:"405px"}},
            {src:"images/m22.png",
                pos:{l:"47px",t:"285px"}},
            {src:"images/m32.png",
                pos:{l:"485px",t:"65px"}},
            {src:"images/m42.png",
                pos:{l:"580px",t:"465px"}},
            {src:"images/m52.png",
                pos:{l:"315px",t:"57px"}},
            {src:"images/m62.png",
                pos:{l:"107px",t:"83px"}},
            {src:"images/m72.png",
                pos:{l:"405px",t:"413px"}},
            {src:"images/m82.png",
                pos:{l:"-1000px",t:"-1000px"}},
            {src:"images/m92.png",
                pos:{l:"482px",t:"212px"}},
            {src:"images/m102.png",
                pos:{l:"197px",t:"195px"}}
        ];
        var m_3=[
            {src:"images/m13.png",
                pos:{l:"42px",t:"15px"}},
            {src:"images/m23.png",
                pos:{l:"350px",t:"233px"}},
            {src:"images/m33.png",
                pos:{l:"250px",t:"383px"}},
            {src:"images/m43.png",
                pos:{l:"255px",t:"480px"}},
            {src:"images/m53.png",
                pos:{l:"528px",t:"475px"}},
            {src:"images/m63.png",
                pos:{l:"326px",t:"460px"}},
            {src:"images/m73.png",
                pos:{l:"465px",t:"99px"}},
            {src:"images/m83.png",
                pos:{l:"72px",t:"398px"}},
            {src:"images/m93.png",
                pos:{l:"100px",t:"208px"}},
            {src:"images/m103.png",
                pos:{l:"416px",t:"296px"}}
        ];
        var arrLists=[];  //用于存储随机出来的img
        var arr=[m,m_1,m_2,m_3];


        function randomHandle() {
            $(".game-before-background").eq(0).empty();
            arrLists=[];
            var npos=Math.floor(Math.random()*4);
            for(var i=0; i<arr[npos].length;i++){
                var Img=new Image();
                Img.src=arr[npos][i].src;
                Img.style.left=arr[npos][i].pos.l;
                Img.style.top=arr[npos][i].pos.t;
                $(".game-before-background").eq(0).append($(Img));
                arrLists.push(Img);
            }

        }

        //随机排序传送带上的40个物品
        var arrL=[];
        function randomSort(a){    //将a数组元素随机排列
            var arr = a,
                random = [],
                len = arr.length;
            for (var i = 0; i < len; i++) {
                var index = Math.floor(Math.random()*(len - i));
                random.push(a[index]);
                arr.splice(index,1);
            }
            return random;
        }
        getRandom()
        function getRandom() {
            arrL=[];
            for(var i=0;i<arr.length;i++){
                var x=arr[i];
                for(var j=0;j<x.length;j++){
                     arrL.push(x[j])
                }
            }
             arrL=randomSort(arrL);
            $(".gaming-lists-ul").eq(0).empty();
            var html="";
            for(var j=0;j<arrL.length;j++){
                html+=`<li><img src="${arrL[j].src}" /></li>`
            }
            $(".gaming-lists-ul").eq(0).html(html);
        }
    }
})();