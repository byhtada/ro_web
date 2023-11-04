console.log( "window loaded" );


$( document ).ready(function() {


    let cookie_token = ""

    var api_url = "http://localhost:3000/";
    let work_mode = 'dev'
    if (window.location.href.includes("github")) {
        work_mode = 'prod'
    }
   // if (work_mode == 'prod') {
        api_url = "https://damp-river-16716-1ebf02a83111.herokuapp.com/"
  //  }
    //api_url = "https://yp-api.herokuapp.com/"
    //work_mode = 'prod'




    let diary_materials = [
        {
            name: "Объятия каждый день...",
            time: "4 мин",
            likes: 25054,
            text: diary_hug
        },
        {
            name: "Если хвалить ребенка каждый день...",
            time: "8 мин",
            likes: 35321,
            text: diary_praise
        },
        {
            name: "Почему так важно говорить о любви",
            time: "7 мин",
            likes: 25054,
            text: diary_love
        },
    ]
    let products = [
        {
            name: "Деревянные пазлы найди половину",
            price: 1500,
            rating: 4.8,
            reviews: 5000,
            text: "Классный продукт. Классный продукт. Классный продукт. Классный продукт. Классный продукт. Классный продукт. ",
            materials: "Дерево",
            skills: "Внимание, логика, моторика",
            age: "3-5 лет",

            article: 11273830,
            link: "https://www.wildberries.ru/catalog/11273830/detail.aspx",
            photos: [
                "http://localhost:3000/img/products/1/1.PNG",
                "http://localhost:3000/img/products/1/2.PNG",
                "http://localhost:3000/img/products/1/3.PNG",
                "http://localhost:3000/img/products/1/4.PNG",
                "http://localhost:3000/img/products/1/5.PNG",
            ]

        }
    ]


    function setProducts(products){
        let html = ''

        products.forEach((item, i) => {
            let name = item.name
            if (item.name.length > 25) {
                name = name.substring(0,25) + "..."
            }


            html += `
                    <div class="card_product" data-id="${item.id}">
                        <img src="${item.photos[0]}"/>
                        <div class="price">${formatNum(item.price)} ₽</div>
                        <div class="name">${name}</div>
                        <div class="stat_container">
                            <img src="img/star.svg">
                            <div class="rating">${item.rating}</div>

                            <img src="img/people.svg">
                            <div class="review">${formatNum(item.reviews)}</div>
                        </div>
                        <div class="btn">Изучить</div>
                    </div> `
        })

        let table = document.getElementById('list_products')
        table.innerHTML = html
        Array.from(table.getElementsByClassName("card_product")).forEach(function(element) {
            element.addEventListener('click', openProduct)
        })

    }
    function openProduct(){
        let product = main_data.products.filter(item => {return item.id == this.getAttribute("data-id")})[0]

        document.getElementById("page_parent").style.display = 'none'
        document.getElementById("page_product").style.display = 'block'
        document.getElementById('product_name').innerHTML = product.name
        document.getElementById('product_skills').innerHTML = product.skills.join(", ")
        document.getElementById('product_text').innerHTML = product.text
        document.getElementById('product_materials').innerHTML = product.materials.join(", ")
        document.getElementById('product_price').innerHTML = formatNum(product.price) + " ₽"
        document.getElementById('product_rating').innerHTML = product.rating + " рейтинг"
        document.getElementById('product_reviews').innerHTML = formatNum(product.reviews) + " отзывов"
        document.getElementById('btn_product_go_wb').setAttribute("data-link", product.link)


        let html = ""
        product.photos.forEach((item, i) => {
            html += `<li><img src="${item}"></li>`
        })
        document.getElementById('product_photos').innerHTML = html


        window.scrollTo(0,0)
    }

    document.getElementById('btn_product_go_wb').addEventListener('click', function(){
        window.open(this.getAttribute("data-link"), "_blank")
    })
    document.getElementById('btn_show_games_company').addEventListener('click', function(){
        setGames(main_data.games)
        let table = document.getElementById('list_games')
        table.style.display = 'block'
        $('html,body').animate({
            scrollTop: $(window).scrollTop() + 250
        });
    })


    let main_data = {}
    start()

    function start(){
        setTimeout(()=> {
            window.scrollTo(0,0);
        }, 200)


        sendRequest('post', 'get_all_data', {})
            .then(data => {
                main_data = data
                console.log("main_data ", main_data)

                setGames(main_data.games)
                let table = document.getElementById('list_games')
                table.style.display = 'block'

                setDiary()
                setDiaryMaterials()


                setProgress()
            })
            .catch(err => console.log(err))

    }



    Array.from(document.getElementsByClassName("progress_container")).forEach(function(element) {
        element.addEventListener('click', openProgress  )
    })
    function openProgress(){

        document.getElementById("page_parent").style.display = 'none'
        document.getElementById("page_progress").style.display = 'block'

        let t = this.getAttribute("data-type")
        let back = `../img/bounty/${t}.png`
        document.getElementById("page_progress").style.background = `#121419 url("${back}") fixed ;`


        let div = document.getElementById('div_progress')
        div.classList.remove("animate__slideInDown")
        div.classList.remove("animate__slideOutUp")
        div.classList.add("animate__slideOutUp")


    }

    function setProgress(){
        let progress_types = ["wisdom", "games", "family"]

        progress_types.forEach(progress_type => {
            let parent = document.querySelector(`.progress_container[data-type="${progress_type}"]`)
            let node = parent.querySelector("circle-progress")
            node.value = main_data.progress[`${progress_type}`].progress
            parent.querySelector("div").innerText = "УР. " + main_data.progress[`${progress_type}`].level
        })
    }

    let progress_timeout = null
    function updateProgress(progress_type){

        let parent = document.querySelector(`.progress_container[data-type="${progress_type}"]`)
        let node = parent.querySelector("circle-progress")
        let icon = parent.querySelector('img.icon')
        let div = document.getElementById('div_progress')

        let main_page_display = document.querySelector('.parent_page[data-page="main"]').style.display

        let icon_timer = 2500
        if (main_page_display == "block" || main_page_display == ""){
            icon.style.display = 'block'

            node.value = main_data.progress[`${progress_type}`].progress
            parent.querySelector("div").innerText = "УР. " + main_data.progress[`${progress_type}`].level

        } else {
            document.getElementById("div_progress").style.display = "block"
            div.classList.remove("animate__slideOutUp")
            div.classList.add("animate__slideInDown")

            icon_timer += 1000
            setTimeout(() => {
                icon.style.display = 'block'
                node.value = main_data.progress[`${progress_type}`].progress
                parent.querySelector("div").innerText = "УР. " + main_data.progress[`${progress_type}`].level
            }, 1000)

            if (progress_timeout != null){
                clearTimeout(progress_timeout)
            }

            progress_timeout = setTimeout(() => {
                div.classList.remove("animate__slideInDown")
                div.classList.add("animate__slideOutUp")
            }, 3000)
        }

        setTimeout(() => {
            icon.style.display = 'none'
        }, icon_timer)
    }



    function setGames(games){
        let table = document.getElementById('list_games')
        let html = ''
        games.forEach(item => {

            let likes = `<img src="img/hearth.svg"/> ${formatNum(item.likes)}`
            likes = ``

            html += `<div class="list_item game" data-id="${item.id}">
<!--                        <img class="start" src="img/btn_play.png"/>-->
                        <div>


                            <div class="info">
                                <div>
                                    <div class="name">${item.name}</div>
                                </div>
                                <div class="stat_container">
                                     ${likes}
                                </div>
                            </div>

                            <div class="needs">${item.needs}</div>
                        </div>

                    </div>`
        })

        table.innerHTML = html

        Array.from(table.getElementsByClassName("list_item")).forEach(function(element) {
            element.addEventListener('click', openGame  )
        });
        function openGame(){
            let game_id =  this.getAttribute("data-id")
            let game = main_data.games.filter(item => {return item.id == game_id})[0]

            showGame(game)
        }
    }
    function showGame(item){
        document.getElementById("page_parent").style.display = 'none'
        document.getElementById("page_game").style.display = 'block'
        document.getElementById("game_name").innerHTML = item.name
        document.getElementById("game_needs").innerHTML = `<span class="text_info">Понадобится</span><br>` + item.needs
        document.getElementById("game_text").innerHTML = item.text
        document.getElementById("game_advice").innerHTML = `<span class="text_info">Совет</span><br>` +  item.advice

        window.scrollTo(0,0)
    }


    //////////////          FABLES          /////////////////
    document.getElementById('btn_show_fables').addEventListener('click', function(){
        setFables(main_data.fables)
        let table = document.getElementById('list_wisdom')
        table.style.display = 'block'
        $('html,body').animate({
            scrollTop: $(window).scrollTop() + 250
        });
    })

    function setFables(fables, favorite = false){
        let table = document.getElementById('list_wisdom')

        let html = '<div class="btn_favorite btn_fable_favorite">ПОКАЗАТЬ ИЗБРАННОЕ</div>'
        if (favorite){
            html = '<div class="btn_favorite btn_fable_all">ПОКАЗАТЬ ВСЕ</div>'
        }



        fables.forEach(item => {
            let icon = item.favorite ? "hearth_orange" : "hearth"

            html += `<div class="list_item fable" data-id="${item.id}">
<!--                        <img class="cover" src="${item.img}"/>-->
                        <div>
                            <div class="name">${item.name}</div>
                            <div class="info">
                                <div class="stat_container likes">
                                    <img src="img/${icon}.svg"/>
                                    ${formatNum(item.likes)}
                                </div>
                                <div class="stat_container">
                                     <img src="img/clock.svg"/>
                                    ${item.time}
                                </div>
                            </div>
                        </div>

<!--                        <img class="start" src="img/btn_play.png"/>-->
                    </div>`
        })
        table.innerHTML = html

        Array.from(table.getElementsByClassName("btn_fable_favorite")).forEach(function(element) {
            element.addEventListener('click', showFableFavorites  )
        })
        Array.from(table.getElementsByClassName("btn_fable_all")).forEach(function(element) {
            element.addEventListener('click', showFableAll  )
        })
        Array.from(table.querySelectorAll(".stat_container.likes")).forEach(function(element) {
            element.addEventListener('click', clickFableFavorite  )
        })

        Array.from(table.getElementsByClassName("list_item")).forEach(function(element) {
            element.addEventListener('click', openFable  )
        });
        function openFable(){
            let fable_id =  this.getAttribute("data-id")
            let fable = main_data.fables.filter(item => {return item.id == fable_id})[0]

            showFable(fable)
        }

    }

    function showFableFavorites(){
        setFables(main_data.fables.filter(item => {return item.favorite}), true)
    }
    function showFableAll(){
        setFables(main_data.fables)
    }

    function clickFableFavorite(e){
        console.log("click0")
        e.stopPropagation()
        e.preventDefault()
        console.log("click1")
        addFableFavorite(this.parentElement.parentElement.parentElement.getAttribute("data-id"))
    }

    function addFableFavorite(fable_id){

        sendRequest('post', 'favorite_fable', {fable_id: fable_id})
            .then(data => {
                main_data.fables = data.fables
                setFables(main_data.fables)
            })
            .catch(err => console.log(err))
    }


    //////////////          LULLABIES          /////////////////
    document.getElementById('btn_show_lullabies').addEventListener('click', function(){
        setLullabies(main_data.lullabies)
        let table = document.getElementById('list_wisdom')
        table.style.display = 'block'
        $('html,body').animate({
            scrollTop: $(window).scrollTop() + 250
        });
    })

    function setLullabies(lullabies, favorite = false){
        let table = document.getElementById('list_wisdom')

        let html = '<div class="btn_favorite btn_lullabies_favorite">ПОКАЗАТЬ ИЗБРАННОЕ</div>'
        if (favorite){
            html = '<div class="btn_favorite btn_lullabies_all">ПОКАЗАТЬ ВСЕ</div>'
        }

        lullabies.forEach(item => {
            let text = `<div id="lullaby_text">${item.text}</div>`
            if (item.text == "") {
                text= ""
            }
            let icon = item.favorite ? "hearth_orange" : "hearth"

            html += `<div class="list_item lullaby" data-id="${item.id}">
                        <div>
                             <img class="start" src="img/btn_play.png"/>

                             <div>
                                <div class="name">${item.name}</div>
                                <div class="info">
                                    <div class="stat_container likes">
                                        <img src="img/${icon}.svg"/>
                                        ${formatNum(item.likes)}
                                    </div>
                                    <div class="stat_container time">
                                         <img src="img/clock.svg"/>
                                        ${item.time}
                                    </div>
                                </div>
                            </div>

                        </div>

                       <div class="lullaby_content">
                            <audio id="lullaby_audio_player" class="samgiit_player" controls preload="none">
                                <source id="lullaby_audio" src="${item.href}" type="audio/ogg">
                            </audio>

                            ${text}
                        </div>
                    </div>`
        })

        table.innerHTML = html

        Array.from(table.getElementsByClassName("list_item")).forEach(function(element) {
            element.addEventListener('click', openLullaby  )
        });
        function openLullaby(){
            this.querySelector(".lullaby_content").style.display = "block"
        }


        Array.from(table.getElementsByClassName("btn_lullabies_favorite")).forEach(function(element) {
            element.addEventListener('click', showLullabiesFavorites  )
        })
        Array.from(table.getElementsByClassName("btn_lullabies_all")).forEach(function(element) {
            element.addEventListener('click', showLullabiesAll  )
        })
        Array.from(table.querySelectorAll(".stat_container.likes")).forEach(function(element) {
            element.addEventListener('click', clickLullabiesFavorite  )
        })
    }

    function showLullabiesFavorites(){
        setLullabies(main_data.lullabies.filter(item => {return item.favorite}), true)
    }
    function showLullabiesAll(){
        setLullabies(main_data.lullabies)
    }

    function clickLullabiesFavorite(e){
        console.log("click0")
        e.stopPropagation()
        e.preventDefault()
        console.log("click1")
        addLullabiesFavorite(this.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id"))
    }

    function addLullabiesFavorite(lullaby_id){

        sendRequest('post', 'favorite_lullaby', {lullaby_id: lullaby_id})
            .then(data => {
                main_data.lullabies = data.lullabies
                setLullabies(main_data.lullabies)
            })
            .catch(err => console.log(err))
    }


    document.getElementById('btn_show_games_alone').addEventListener('click', function(){
        document.getElementById('list_games').innerHTML = `<div style="text-align: center; margin-top: 30px; font-size: 22px;">В процессе исследования...</div>`
        //setGames(main_data.games)


        let table = document.getElementById('list_games')
        table.style.display = 'block'
        $('html,body').animate({
            scrollTop: $(window).scrollTop() + 250
        });
    })






    document.getElementById('btn_today_game').addEventListener('click', function(){
        let game_id =   document.getElementById('btn_today_game').getAttribute("data-id")
        let game = main_data.games.filter(item => {return item.id == game_id})[0]

        showGame(game)
    })

    document.getElementById('btn_today_fable').addEventListener('click', function(){
        let fable_id =   document.getElementById('btn_today_fable').getAttribute("data-id")
        let fable = main_data.fables.filter(item => {return item.id == fable_id})[0]

        showFable(fable)
    })
    function showFable(item){
        document.getElementById("page_parent").style.display = 'none'
        document.getElementById("page_fable").style.display = 'block'
        document.getElementById("fable_name").innerHTML = item.name
        document.getElementById("fable_text").innerHTML = item.text

        window.scrollTo(0,0)
    }


    Array.from(document.getElementsByClassName("close_detail")).forEach(function(element) {
        element.addEventListener('click', closeDetail  )
    });
    function closeDetail(){
        document.getElementById("page_game").style.display = 'none'
        document.getElementById("page_fable").style.display = 'none'
        document.getElementById("page_diary_material").style.display = 'none'
        document.getElementById("page_product").style.display = 'none'
        document.getElementById("page_progress").style.display = 'none'
        document.getElementById("page_parent").style.display = 'block'

        let div = document.getElementById('div_progress')
        div.classList.remove("animate__slideInDown")
        div.classList.remove("animate__slideOutUp")
        if (last_page == "main"){
            div.classList.add("animate__slideInDown")
        }else {
            div.classList.add("animate__slideOutUp")
        }

    }


    function setDiaryMaterials(){
        let html = ''
        diary_materials.forEach((item, i) => {

            html += `
                 <div class="list_item diary_material" data-id="${i}">
                        <div>
                            <img class="start" src="img/book.svg">

                            <div>
                                <div class="name">${item.name}</div>
                                <div class="info">
                                    <div class="stat_container likes">
                                        <img src="img/hearth.svg">
                                        ${formatNum(item.likes)}
                                    </div>
                                    <div class="stat_container time">
                                        <img src="img/clock.svg">
                                        ${item.time}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            `
        })

        let table = document.getElementById('list_diary_materials')
        table.innerHTML = html

        Array.from(table.getElementsByClassName('list_item')).forEach(element => {
            element.addEventListener("click", openDiaryMaterial)
        })
    }
    function openDiaryMaterial(){
        let m = diary_materials[this.getAttribute("data-id")]

        document.getElementById("page_parent").style.display = 'none'
        document.getElementById("page_diary_material").style.display = 'block'
        document.getElementById('diary_material_name').innerHTML = m.name
        document.getElementById('diary_material_text').innerHTML = m.text



        window.scrollTo(0,0)
    }


    function setDiary(){
        Array.from(document.querySelectorAll(`.diary_checkbox[data-point="hug"]`)).forEach(function(element) {
            element.checked = main_data.diary_today.hug
        })
        Array.from(document.querySelectorAll(`.diary_checkbox[data-point="praise"]`)).forEach(function(element) {
            element.checked = main_data.diary_today.praise
        })
        Array.from(document.querySelectorAll(`.diary_checkbox[data-point="love"]`)).forEach(function(element) {
            element.checked = main_data.diary_today.love
        })

        checkDiaryForFull()
    }
    Array.from(document.getElementsByClassName("diary_checkbox")).forEach(function(element) {
        element.addEventListener('change', changeDiaryCheckbox  )
    });
    function changeDiaryCheckbox(){
        console.log("changeDiaryCheckbox ", this.checked)

        sendRequest('post', 'update_diary', {point: this.getAttribute("data-point"), checked: this.checked})
            .then(data => {
                main_data.diary_today = data.diary_today
                main_data.progress = data.progress
                setDiary()
                updateProgress("family")
            })
            .catch(err => console.log(err))
    }
    function checkDiaryForFull(){
        let complete = main_data.diary_today.hug && main_data.diary_today.praise && main_data.diary_today.love

        Array.from(document.getElementsByClassName("card_diary")).forEach(function(element) {
            element.classList.remove("complete")
            if (complete){
                element.classList.add("complete")
            }
        })
    }



    let last_page = "main"
    $(document).on('click', '.nav_bottom',  function () {

        $('.nav_bottom').removeClass("active")

        $(this).addClass("active")
        $('.nav_bottom.active div').css("display", "block")
        last_page = $(this).attr("data-page");

        showMainPage(last_page);
        window.history.pushState(last_page, "another page", "#" + last_page);

    });

    function showMainPage(page){
        $('.parent_page').css('display', 'none')

        if (page == "") {
            page = "main";
        }

        if (page == "shop"){
            setProducts(main_data.products)
        }

        $('.icon_main')    .addClass("inactive");
        $('#nav_icon_main')    .attr("src", "img/nav/no_active/icon_main.svg");
        $('#nav_icon_games').attr("src", "img/nav/no_active/icon_games.svg");
        $('#nav_icon_wisdom')   .attr("src", "img/nav/no_active/icon_wisdom.svg");
        $('#nav_icon_diary')    .attr("src", "img/nav/no_active/icon_diary.svg");
        $('#nav_icon_shop')      .attr("src", "img/nav/no_active/icon_shop.svg");


        var icon_id   = 'nav_icon_' + page;
        var icon_path = 'img/nav/active/icon_' + page + '.svg?v2.51';
        $('#' + icon_id)   .attr("src", icon_path);

        document.body.style.background = ` #121419  url("../img/page_back/${page}.png") fixed`

        $(`.parent_page[data-page="${page}"]`).css("display", "block")
        window.scrollTo(0,0);


        let div = document.getElementById('div_progress')
        div.classList.remove("animate__slideInDown")
        div.classList.remove("animate__slideOutUp")
        if (page == "main"){
            div.classList.add("animate__slideInDown")
        }else {
            div.classList.add("animate__slideOutUp")
        }

    }








    function showAlert(text){
        $('#alert_simple').empty().append(text).css("visibility", "visible").show().delay(2000).fadeOut(3000);
    }
    function showAlertLong(text){
        $('#alert_simple').empty().append(text).css("visibility", "visible").show().delay(8000).fadeOut(3000);
    }



    function showError(){
        var error_text = "";
        var userLang = window.navigator.language;
        var lang = userLang.split("-")[0];

        if (main_data === "") {
            switch (lang){
                case 'ru':
                    error_text = " Если Вы видете это окно, то видимо возникли какие-то трудности :(\n" +
                        "        <br><br>Попробуйте следующие шаги в такой последовательности:\n" +
                        "        <br>1. Проверьте подключение к интернету\n" +
                        "        <br>2. Если интернет работает, но вы все ещё видите это - очистите кэш и файлы cookies браузера (или переустановите его)\n" +
                        "        <br>3. Если п1,2. не сработали - пишите @aashesh(Telegram)<br>. К сообщению сразу прикрепляйте свою почту\n";

                    break;
                case 'en':
                    error_text = "If you see this window, apparently you've experienced some difficulty.\n" +
                        "         <br> <br> Try the following steps in this sequence:\n" +
                        "         <br> 1. Check your internet connection.\n" +
                        "         <br> 2. If internet works, but you still see it, clear the browser cache and cookies (or reinstall it).\n" +
                        "         <br> 3. If step 1 and 2 didn't work, write @aashesh (Telegram) or +38 097 314 3889 (Viber, WhatsApp). Attach your email to the message.";
                    break;

                default:
                    error_text = "If you see this window, apparently you've experienced some difficulty.\n" +
                        "         <br> <br> Try the following steps in this sequence:\n" +
                        "         <br> 1. Check your internet connection.\n" +
                        "         <br> 2. If internet works, but you still see it, clear the browser cache and cookies (or reinstall it).\n" +
                        "         <br> 3. If step 1 and 2 didn't work, write @aashesh (Telegram) or +38 097 314 3889 (Viber, WhatsApp). Attach your email to the message.";

                    break;
            }

            $('#div_error').empty().append(error_text).show();

        }

    }

    function parse_query_string() {
        var hashParams = {};
        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&;=]+)=?([^&;]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
            q = window.location.hash.substring(1);

        while (e = r.exec(q))
            hashParams[d(e[1])] = d(e[2]);

        return hashParams;

        // if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){
//
        //     var key = false, res = {}, itm = null;
        //     // get the query string without the ?
        //     var qs = location.search.substring(1);
        //     // check for the key as an argument
        //     if (arguments.length > 0 && arguments[0].length > 1)
        //         key = arguments[0];
        //     // make a regex pattern to grab key/value
        //     var pattern = /([^&=]+)=([^&]*)/g;
        //     // loop the items in the query string, either
        //     // find a match to the argument, or build an object
        //     // with key/value pairs
        //     while (itm = pattern.exec(qs)) {
        //         if (key !== false && decodeURIComponent(itm[1]) === key)
        //             return decodeURIComponent(itm[2]);
        //         else if (key === false)
        //             res[decodeURIComponent(itm[1])] = decodeURIComponent(itm[2]);
        //     }
//
        //     return key === false ? res : null;
        // } else {
//
        //     var url_string = window.location.href; //window.location.href
        //     var url = new URL(url_string);
        //     var query = url.hash.replace('#', '');
        //     var vars = query.split("&");
        //     var query_string = {};
        //     for (var i = 0; i < vars.length; i++) {
        //         var pair = vars[i].split("=");
        //         var key = decodeURIComponent(pair[0]);
        //         var value = decodeURIComponent(pair[1]);
        //         // If first entry with this name
        //         if (typeof query_string[key] === "undefined") {
        //             query_string[key] = decodeURIComponent(value);
        //             // If second entry with this name
        //         } else if (typeof query_string[key] === "string") {
        //             var arr = [query_string[key], decodeURIComponent(value)];
        //             query_string[key] = arr;
        //             // If third or later entry with this name
        //         } else {
        //             query_string[key].push(decodeURIComponent(value));
        //         }
        //     }
        //     return query_string;
        // }


    }



    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }



    function checkOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
            showAlert('На технике Apple пока работает не весь функционал');
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
            showAlert('На технике Apple пока работает не весь функционал');
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }

    function setCookie(name, value, days = 1600) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function deleteCookie( name ) {
        document.cookie = name + '=undefined; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }
    //window.addEventListener("hashchange", function(e) {
    //    if(e.oldURL.length > e.newURL.length)
    //        $('#logo').click();
    //});



    $.ajaxSetup({
        error: function (data, textStatus, jqXHR) {
            console.log("ajaxSetup");
            console.log(data);

            if (data.status == 401) {
                console.log("Error 401");
                $('#page_login').show();
                $('.wrapper_top_bar').hide();
                $("#page_user_main") .hide();
                $('#page_admin_main').hide();
                //  console.log(data.responseText.includes("Incorrect credentials"));

                if (data.responseText.includes("Incorrect credentials")) {
                    showAlert(alert_error_login);
                }
                if (data.responseText.includes("Bad Token")) {
                    cookie_token = getCookie(cookie_name_token);
                }
            }

            if (data.status == 500) {
                console.log("Error 500 ");
            }
        }
    });
    if (!navigator.cookieEnabled) {
        showAlert(alert_enable_cookies);
    }

    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }


    function getOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }


    function formatNum(num, empty_if_null = false){

        const string = num.toString()
        const array = string.split("").reverse()

        let new_array = []
        array.forEach((element, i) => {

            new_array.push(element)
            if ([2,5,8,11].includes(i)) {
                new_array.push(" ")
            }
        });

        if (empty_if_null && num == 0) {
            new_array = [""]
        }

        if (isNaN(num)) {
            new_array = [0]
        }

        return new_array.reverse().join("")
    }


    function sendRequest(type, url, body = null) {
        const headers = {
            'Authorization': 'Token token=' + cookie_token,
            'Content-type': 'application/json'
        }

        return fetch(`${api_url}${url}`, {
            method: type,
            body: JSON.stringify(body),
            headers: headers
        }).then(response => {
            return response.json()
        })
    }

});
