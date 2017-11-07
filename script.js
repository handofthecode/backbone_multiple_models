var ItemModel = Backbone.Model.extend({});

var Items = Backbone.Collection.extend({
  Model: ItemModel,
  seedItems: function(seed) {
    var self = this;
    seed.forEach(function(item, i) {
      item.id = self.serialId++;
      var model = new ItemModel(item);
      self.add(model);
    });
  },
  initialize: function(seed) {
    this.serialId = 1;
    this.comparator = 'name';
    this.seedItems(seed);
  },
});

var ItemsView = Backbone.View.extend({
  el: 'tbody',
  template: Handlebars.compile($('#items').html()),
  render: function() {
    this.$el.html(this.template({ items: this.collection.toJSON() }));
  },
  events: {
    'click a' : 'handleDelete',
  },
  handleDelete: function(e) {
    e.preventDefault();
    var $target = $(e.target);
    var id = $target.attr('data-id');
    this.collection.remove(id);
    $target.closest('tr').remove();
  },
  initialize: function() {
    this.listenTo(this.collection, "rerender sort reset", this.render)
    Handlebars.registerPartial('item', $('#item').html());
    this.render();
  }
});

var app = {
  registerListeners: function() {
    this.$form.on('submit', this.handleSubmit.bind(this));
    this.$deleteAll.on('click', this.handleDeleteAll.bind(this));
    this.$categories.on('click', this.handleSort.bind(this));
  },
  handleSort: function(e) {
    this.items.comparator = e.target.dataset.prop;
    this.items.sort();
  },
  handleDeleteAll: function() {
    this.items.reset();
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.items.add({ 
      name: this.$name.val(),
      quantity: this.$quantity.val(),
      id: this.items.serialId++,
    });
    this.view.render();  
  },
  handleDelete: function(e) {
    e.preventDefault();
    var $target = $(e.target);
    var id = $target.attr('data-id');
    this.items.remove(id);
    $target.closest('tr').remove();
  },
  init: function() {
    this.$categories = $('th');
    this.$form = $('form');
    this.$deleteAll = $('#delete-all');
    this.$name = $('[name=name]');
    this.$quantity = $('[name=quantity]');
    this.items = new Items(items_json);
    this.view = new ItemsView({ collection: this.items })
    this.registerListeners();
  }
}

app.init();

// var App = {
//   init: function() {
//     this.Items = new ItemsCollection(items_json);
//     this.View = new ItemsView({ collection: this.Items });
//     this.Items.sortByName();
//   }
// };

// var ItemModel = Backbone.Model.extend({
//   idAttribute: "id",
//   initialize: function() {
//     this.collection.incrementID();
//     this.set("id", this.collection.last_id);
//   }
// });

// var ItemsView = Backbone.View.extend({
//   events: {
//     "click a": "removeItem"
//   },
//   template: Handlebars.compile($("#items").html()),
//   render: function() {
//     this.$el.html(this.template({
//       items: this.collection.toJSON()
//     }));
//   },
//   removeItem: function(e) {
//     e.preventDefault();
//     var model = this.collection.get(+$(e.target).attr("data-id"));
//     this.collection.remove(model);
//   },
//   initialize: function() {
//     this.$el = $("tbody");
//     this.render();
//     this.listenTo(this.collection, "remove reset rerender", this.render);
//   }
// });

// var ItemsCollection = Backbone.Collection.extend({
//   last_id: 0,
//   model: ItemModel,
//   incrementID: function() {
//     this.last_id++;
//   },
//   sortBy: function(prop) {
//     this.models = _(this.models).sortBy(function(m) {
//       return m.attributes[prop];
//     });
//     this.trigger("rerender");
//   },
//   sortByName: function() { this.sortBy("name"); },
//   initialize: function() {
//     this.on("add", this.sortByName);
//   }
// });

// Handlebars.registerPartial("item", $("#item").html());

// $("form").on("submit", function(e) {
//   e.preventDefault();
//   var inputs = $(this).serializeArray(),
//       attrs = {},
//       item;

//   inputs.forEach(function(input) {
//     attrs[input.name] = input.value;
//   });

//   item = App.Items.add(attrs);
//   this.reset();
// });

// $("th").on("click", function() {
//   var prop = $(this).attr("data-prop");
//   App.Items.sortBy(prop);
// });

// $("p a").on("click", function(e) {
//   e.preventDefault();
//   App.Items.reset();
// });

// App.init();






