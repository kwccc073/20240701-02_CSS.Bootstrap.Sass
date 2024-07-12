/* 生物種族的active--------------------------- */
$('#race a').on('click', function () {
    // 先清掉 9 個種族的 active 狀態
    $('#race a').removeClass('active')
    // 再為點選的那個種族加上 active
    $(this).addClass('active')
})

/* swiper--------------------------------*/
const swiper = new Swiper('#swiper', {
    // 基礎效果設定
    direction: 'horizontal',
    loop: true,
    speed: 1000,
    // https://swiperjs.com/demos#responsive-breakpoints
    slidesPerView: 1,
    spaceBetween: 10,
    // 自動撥放
    autoplay: {
        // 5秒下一張
        delay: 500
    },

    // 效果coverflow ： https://swiperjs.com/demos#effect-coverflow
    effect: "coverflow",
    centeredSlides: true,
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    },

    // 每個斷點顯示幾張：https://swiperjs.com/demos#responsive-breakpoints
    breakpoints: {
        576: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 3,
        },
        920: {
            slidesPerView: 3,
        },
        1200: {
            slidesPerView: 4,
        }
    },
    // 分頁：https://swiperjs.com/demos#responsive-breakpoints
    pagination: {
        el: ".swiper-pagination",
        dynamicBullets: false,
        clickable: true,
    },
    // 上一張、下一張：https://swiperjs.com/demos#navigation
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
})

// GSAP-----------------------------------------------------
// 註冊plugin
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// ScrollToPlugin--------------------------------------------
// 這個 Plugin 之用途是點選連結，滑動至該區塊的位置動畫
$('#navbar .main-link, .backtop a').each(function (index, link) {
    $(this).on('click', function (e) {
        e.preventDefault()
        if ($(this).attr('href') === '#section04' || $(this).attr('href') === '#section05') {
            gsap.to($(window), {
                scrollTo: {
                    y: `#section0${index + 1}`,
                },
                duration: 1.5,
                ease: 'back.inOut'
            })
        } else {
            gsap.to($(window), {
                scrollTo: {
                    y: `#section0${index + 1}`,
                    offsetY: 150 // 位移
                },
                duration: 1.5,
                ease: 'back.inOut'
            })
        }
    })
})

// 流星--------------------------------------------------------------
// 管道模式，可以設定一系列的流程，將函式的結果return給下一個函式，當作參數接收使用
/*
fun1 -> return x
fun2 <- x
fun2 -> return y
fun3 <- y
fun3 -> return z
*/
// 將流星動畫拆成三步驟
// 1. 創建流星數目
function createStar(starNumber) {
    for (let i = 0; i < starNumber; i++) {
        $('.shooting_star').append('<div class="star"></div>')
    }
    // toArray()是gsap內建的，可以將非陣列的陣列變成真正的陣列
    const stars = gsap.utils.toArray('.star')
    return stars
}
// 2. 設定補間動畫預設值
function setStarTween(stars) {
    // console.log(stars)
    gsap.set('.shooting_star', {
        // 透視效果
        perspective: 800
    })
    stars.forEach(function (star, index) {
        gsap.set(star, {
            transformOrigin: '0 50%', // '預設50% 50% => 0 50%'
            position: 'absolute',
            left: gsap.utils.random($(window).width() / 2, $(window).width() * 2),
            top: gsap.utils.random(-100, -200),
            rotation: -25
        })
    })
    return stars
}

// 3. 執行流星動畫
function playStarTimeLine(stars) {
    const tl = gsap.timeline({
        repeat: -1
    })
    tl.to(stars, {
        // 往左邊
        x: `-=${$(window).width() * 1.5}`,
        // 往下
        y: `+=${$(window).width() * 1.5}`,
        z: 'random(-100, 500)',
        // 交錯
        stagger: function (index, target, star) {
            return gsap.utils.random(index + 5, (index + 5) * 2, 1) // 第三個參數設定為1，表示取整數
        },
        duration: 'random(0.5, 3,0.1)',
        ease: 'none'
    })
}

// 回傳一個函式
const playStar = gsap.utils.pipe(createStar, setStarTween, playStarTimeLine)
playStar(30)

// ScrollTrigger 滾動控制-----------------------------------------------
// backtop 回頂端顯示隱藏
gsap.to('.backtop', {
    scrollTrigger: {
        trigger: '#footer',
        start: 'top bottom',
        end: '100% bottom',
        toggleActions: 'play none none reverse',
        // marks: true
    },
    display: 'block',
    opacity: 1,
    duration: 1
})

// 導覽列收合----------------------------------------------------------------
gsap.from('#navbar', {
    // 進場
    // 從下面設定的位置跑到原本的位置
    yPercent: -100, // -100%，表示視窗的外面
    duration: 0.5,
    // paused: true,
    scrollTrigger: {
        start: 'top 60',
        // 兩種寫法：JQ或原生JS
        // end:() => '+=' + $(document).height(),
        end: () => '+=' + document.documentElement.scrollHeight,
        onEnter(self) {
            console.log(self.animation)
            // self 指的是 scrollTrigger，它身上綁定了很多屬性，其中animation指的是該補間動畫，也就是我們的導覽列
            // .play是撥放動畫
            self.animation.play()
        },
        // onUpdate()是 scrollTrigger在範圍內更新時會呼叫的函式
        onUpdate(self) {
            console.log(self.direction)
            self.direction === -1 ? self.animation.play() : self.animation.reverse()
        },
        markers: false,
    }
})

// 導覽列active位置----------------------------------------------------------
$('.main-link').each(function (index, link) {
    let href = $(link).attr('href')
    // console.log(href)
    gsap.to(link, {
        scrollTrigger: {
            trigger: `${href}`,
            start: 'top center',
            end: 'bottom center',
            toggleClass: {
                targets: link,
                className: 'active'
            },
            markers: false
        }
    })
})

// 視覺效果---------------------------------------------
// 星空背景跟著捲動軸緩慢移動
gsap.to('body', {
    scrollTrigger: {
        trigger: 'body',
        start: 'top 0%',
        end: 'bottom 0%',
        scrub: 5
    },
    backgroundPosition: '50% 100%',
    ease: 'none',
})

// 視差元素：浮空島----------
// 建立一個時間軸，用來放置三座島的進場動畫
const float_t1 = gsap.timeline({
    scrollTrigger: {
        trigger: 'body',
        start: 'top 100%',
        end: 'bottom 100%',
        scrub: 5
    },
    ease: 'none'
})

float_t1
    .from('.float-wrap-01', {
        left: '-30%'
    })
    // '<'表示起始位置和前面對齊
    .from('.float-wrap-02', {
        right: '-30%'
    }, '<')
    .from('.float-wrap-03', {
        bottom: '-100%'
    }, '<')

// 浮空島本身上下移動動畫
$('.float-island').each(function (index, island) {
    gsap.to(island, {
        y: 50 * (index + 1),
        duration: 10 * (index + 1),
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    })
})

// 視差元素：霧------
$('.fog').each(function (index, fog) {
    // gsap.set()設定一個補間動畫的初始預設值
    gsap.set(fog, {
        width: '100%',
        height: '100%',
        background: `url(./images/fog.png) no-repeat center/80%`,
        opacity: 0.8,
        position: 'absolute',
        // 設定隨機位置
        top: 'random(0,100)' + '%',
        x: function () {
            // 偶數雲設定為 -視窗寬度值（會被丟到視窗左邊外面），奇數雲設定為視窗寬度值（會被丟到視窗左邊外面）
            return index % 2 === 0 ? -$(window).width() : $(window).width()
        }
    })
    gsap.to(fog, {
        x: function () {
            // 偶數雲從左側跑到右側，奇數雲從右側跑到左側
            return index % 2 === 0 ? $(window).width() : -$(window).width()
        },
        // 重複播放時，重新設定雲的top位置
        onRepeat() {
            $(fog).css({
                top: gsap.utils.random(0, 100) + '%'
            })
        },
        repeat: -1,
        duration: 60,
        ease: 'none'
    })
})