const header = document.querySelector('.header-fixed');
header.innerHTML = `<div class="header-limiter">

    <h1><a href="#">El3olya<span>Score</span></a></h1>
    <nav>
        <a href="el3olya.html" class="navItem" onclick="itemClicked(this)">الرئيسيه</a>
        <a href="users.html" class="navItem" onclick="itemClicked(this)">الخدام</a>
        <a href="trtiby.html" class="navItem" onclick="itemClicked(this)">ترتيبى</a>
        <a href="#" class="navItem" onclick="itemClicked(this)">عن الخدمه</a>
    </nav>

</div>
<div class="header-fixed-placeholder"></div>'`;