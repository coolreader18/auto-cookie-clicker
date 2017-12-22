// ==Bookmarklet==
// @name Auto Cookie Clicker
// @author coolreader18
// @script https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @script https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @script https://cdn.jsdelivr.net/npm/js-cookie/src/js.cookie.min.js
// ==/Bookmarklet==
var options = this.options;

function openOptions() {
  var opts = options,
    optionsWindow = openOptWin(),
    optDoc = optionsWindow.document,
    $options = $(optDoc.body);
  $(optionsWindow).focusout(e => {
    e.target.close()
  })
  optDoc.title = "AutoCookie Options";
  $options.append("<h1>AutoCookie Options</h1>")
    .append("<h2>Auto Clicking Options</h2>")
    .append($("<div>")
      .append($("<p>")
        .append($("<input type='checkbox' id='bigCookie'>").prop("checked", opts.bigCookie))
        .append("<label for='bigCookie'>Big Cookie</label>")
        .append("<br>")
        .append($("<label for='cps'>Clicks per second:</label>").css("padding-right", "2px"))
        .append($("<input id='cps' type='number' min=100 step=100>").css("width", "40px").val(opts.cps)))
      .append($("<input type='checkbox' id='goldenCookie'>")
        .prop("checked", opts.goldenCookie))
      .append("<label for='goldenCookie'>Golden Cookie</label>"))
    .append("<h2>Auto Buying Options</h2>")
    .append($("<div>").css("width", "100%")
      .append($("<div>")
        .append("<h3>Buying</h3>")
        .append($("<ol id='buying' class='products'>").data("items", opts.buying)))
      .append($("<div>")
        .append("<h3>Not Buying</h3>")
        .append($("<ol id='notBuying' class='products'>").data("items", opts.notBuying))))
    .append("<button onclick='window.close()'>Done</button>");

  $(".products", optDoc).css({
    border: "1px solid #eee",
    width: "142px",
    "min-height": "20px",
    "list-style-type": "none",
    margin: "0",
    padding: "5px 0 0 0",
    float: "left",
    "margin-right": "10px"
  }).each(function(i, list) {
    $(list).data("items").forEach(function(item) {
      $(list).append($("<li>").attr("data-product", JSON.stringify(item)).text(item.title).css({
        margin: "0 5px 5px 5px",
        padding: "5px",
        "font-size": "1.2em",
        width: "120px"
      }))
    })
  }).sortable({
    connectWith: ".products",
    update: function() {
      $(".products", optDoc).each(function(i, list) {
        var cur = opts[i ? "notBuying" : "buying"] = [];
        $(list).children().each(function(i, li) {
          cur.push($(li).data("product"));
        })
      })
      updateCookie();
    }
  }).disableSelection();
  $("div", optDoc).css({
    display: "inline-block",
    "padding-bottom": "10px"
  });
  $("input[type='checkbox']", optDoc).change(e => {
    opts[e.currentTarget.id] = e.currentTarget.checked;
    updateCookie();
  })
  $("#cps", optDoc).change(e => {
    opts.cps = Number(e.currentTarget.value);
    updateCookie();
  })
}

if (this.clicks) {
  openOptions();
} else {
  this.options = Cookies.getJSON("AutoCookieOptions") || {
    bigCookie: true,
    cps: 100,
    goldenCookie: true,
    buying: [],
    notBuying: [{
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
    }]
  };
  options = this.options;
  updateCookie();
  setInterval(function() {
    var opts = options;
    if (opts.bigCookie) {
      for (var i = 0; i < opts.cps / 100; i++) {
        $("#bigCookie").click();
      }
    }
    if (opts.goldenCookie) {
      $("#goldenCookie").click();
    }
    var buy = opts.buying[Symbol.iterator]();
    buyNext();

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

function updateCookie() {
  Cookies.set("AutoCookieOptions", options, {
    expires: 365
  });
}
