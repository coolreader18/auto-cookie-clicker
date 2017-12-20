function openOptions() {
  var opts = this.options,
    optionsWindow = openOptWin();
  $(optionsWindow).focusout(e => {e.target.close()})
  optDoc = optionsWindow.document;

  optDoc.title = "AutoCookie Options";
  var $options = $(optDoc.body),
    buying, notBuying;
  $options.append("<h1>AutoCookie Options</h1>")
    .append("<h2>Auto Clicking Options</h2>")
    .append($("<div>")
      .append($("<input type='checkbox' id='bigCookie'>")
        .prop("checked", opts.bigCookie))
      .append("<label for='bigCookie'>Big Cookie</label>"))
    .append("<br>")
    .append($("<input type='checkbox' id='goldenCookie'>")
      .prop("checked", opts.goldenCookie))
    .append("<label for='goldenCookie'>Golden Cookie</label>")
    .append("<h2>Auto Buying Options</h2>")
    .append($("<div>").css("width", "100%")
      .append($("<div>")
        .append("<h3>Buying</h3>")
        .append(buying = $("<ol id='buying' class='products'>")))
      .append($("<div>")
        .append("<h3>Not Buying</h3>")
        .append(notBuying = $("<ol id='notBuying' class='products'>"))))
    .append("<button onclick='window.close()'>Done</button>")
  $(optDoc.head).append(`<style>
    #buying, #notBuying {
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
  }
  #buying li, #notBuying li {
    margin: 0 5px 5px 5px;
    padding: 5px;
    font-size: 1.2em;
    width: 120px;
  }</style>`)

  opts.buying.forEach(function(product) {
    buying.append($("<li class='ui-sortable'>").data("object", product).html(product.title));
  })
  opts.notBuying.forEach(function(product) {
    notBuying.append($("<li class='ui-sortable'>").data("object", product).html(product.title));
  })

  $("#buying, #notbuying", optDoc).sortable({
    connectWith: ".products"
  }).disableSelection().on("sortout", function() {
    opts.buying = [];
    $("#buying li", optDoc).each(function(i, li) {
      opts.buying.push($(li).data("object"));
    })
    opts.notBuying = [];
    $("#notBuying li", optDoc).each(function(i, li) {
      opts.notBuying.push($(li).data("object"));
    })
    updateCookie();
  });
}

if (this.clicks) {
  openOptions();
} else {
  var JSONopts = Cookies.getJSON("AutoCookieOptions");
  this.options = JSONopts || {
    bigCookie: true,
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
  updateCookie();
}

setInterval(function() {
  if (options.bigCookie) {
    $("#bigCookie").click();
  }
  if (options.goldenCookie) {
    $("#goldenCookie").click();
  }
  var buy = options.buying[Symbol.iterator]();
  buyNext();

  function buyNext() {
    var curitem = $("#product" + buy.next().value.ind + ".enabled");
    if (curitem.length) {
      curitem.click();
    } else {
      buyNext();
    }
  }
}, 10)

function openOptWin() {
  return window.open("", "AutoCookieOptions", "height=600,width=400,status=yes,toolbar=no,menubar=no,location=no");
}

function updateCookie() {
  Cookies.set("AutoCookieOptions", options, {
    expires: 365
  });
}
