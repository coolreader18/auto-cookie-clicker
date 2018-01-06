// ==Bookmarklet==
// @name Auto Cookie Clicker
// @author coolreader18
// @script dir jquery-ui
// @script dir js-cookie
// ==/Bookmarklet==
var updateCookie = () => {
  Cookies.set("AutoCookieOptions", this.options, {
    expires: 365
  });
};

openOptions = () => {
  var opts = this.options,
  optionsWindow = openOptWin(),
  optDoc = optionsWindow.document;
  $(optionsWindow).focusout(e => {
    e.target.close();
  });
  $(optDoc.head).html(
`<title>AutoCookie Options</title>
<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<style>
.products {
  border: 1px solid #eee;
  width: 142px;
  min-height: 20px;
  list-style-type: none;
  margin: 0;
  padding: 5px 0 0 0;
  float: left;
  margin-right: 10px;
}
div {
  display: inline-block;
  padding-bottom: 10px;
}
#cps {
  width: 40px;
}
</style>`)
  $(optDoc.body).html(
`<h1>AutoCookie Options</h1>
<h2>Auto Clicking Options</h2>
<div>
  <p>
    <input type='checkbox' id='bigCookie' checked='${opts.bigCookie}'>
    <label for='bigCookie'>Big Cookie</label>
    <br>
    <label for='cps'>Clicks per second: </label>
    <input id='cps'>
  </p>
  <p>
    <input type='checkbox' id='goldenCookie' checked="${opts.goldenCookie}">
    <label for='goldenCookie'>Golden Cookie</label>
  </p>
</div>
<h2>Auto Buying Options</h2>
<div style="width: 100%">
  <div>
    <h3>Buying</h3>
    <ol id='buying' class='products' data-items='${JSON.stringify(opts.buying)}'>
  </div>
  <div>
    <h3>Not Buying</h3>
    <ol id='notBuying' class='products' data-items='${JSON.stringify(opts.notBuying)}'>
  </div>
</div>
<button onclick='window.close()'>Done</button>`);
  $("#cps", optDoc).spinner({
    min: 100,
    step: 100,
    page: 5
  }).on("change spin", e => {
    var cps = $(e.currentTarget);
    if (!cps.spinner("isValid")) {
      cps.val(100)
    }
    opts.cps = cps.val() / 1;
    updateCookie();
  }).val(opts.cps);
  $(".ui-spinner", optDoc).css("height", "30px");
  $(".products", optDoc).each(function(i, list) {
    $(list).data("items").forEach(item => {
      $(list).append($("<li>").attr("data-product", JSON.stringify(item)).text(item.title).css({
        margin: "0 5px 5px 5px",
        padding: "5px",
        "font-size": "1.2em",
        width: "120px"
      }));
    });
  }).sortable({
    connectWith: ".products",
    update: function() {
      $(".products", optDoc).each(function(i, list) {
        var cur = opts[i ? "notBuying" : "buying"] = [];
        $(list).children().each(function(i, li) {
          cur.push($(li).data("product"));
        });
      });
      updateCookie();
    }
  }).disableSelection();
  $("input[type='checkbox']", optDoc).change(e => {
    opts[e.currentTarget.id] = e.currentTarget.checked;
    updateCookie();
  });
};

if (this.clicks) {
  openOptions();
} else {
  this.options = Cookies.getJSON("AutoCookieOptions") || {
    bigCookie: true,
    cps: 100,
    goldenCookie: true,
    buying: [],
    notBuying: [ {
      ind: 0,
      title: "Cursor"
    }, {
      ind: 1,
      title: "Grandma"
    }, {
      ind: 2,
      title: "Farm"
    }, {
      ind: 3,
      title: "Factory"
    }, {
      ind: 4,
      title: "Mine"
    }, {
      ind: 5,
      title: "Shipment"
    }, {
      ind: 6,
      title: "Alchemy lab"
    }, {
      ind: 7,
      title: "Portal"
    }, {
      ind: 8,
      title: "Time machine"
    }, {
      ind: 9,
      title: "Antimatter condenser"
    } ]
  };
  updateCookie();
  setInterval(() => {
    var opts = this.options;
    if (opts.bigCookie) {
      for (var i = 0; i < opts.cps / 100; i++) {
        $("#bigCookie").click();
      }
    }
    if (opts.goldenCookie) {
      $("#goldenCookie").click();
    }
    var buy = opts.buying[Symbol.iterator]();
    if (opts.buying.length){
      buyNext();
    }
    function buyNext() {
      var curitem = $("#product" + buy.next().value.ind + ".enabled");
      if (curitem.length) {
        curitem.click();
      } else {
        buyNext();
      }
    }
  });
}

function openOptWin() {
  return window.open("", "AutoCookieOptions", "height=600,width=400,status=yes,toolbar=no,menubar=no,location=no");
}
