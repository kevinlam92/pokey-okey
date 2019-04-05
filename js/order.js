//Vue

function initValue() {
  return {
    value: 0
  }
}

Vue.component('build-protein-item', {
  props: ['prefix', 'id', 'name', 'scoops', 'price'],
  data: function() {
    return initValue();
  },
  template: '<div class="form-group row">' +
    '<label v-bind:for="prefix + id" class="col col-form-label">{{ name }}<template v-if="parseFloat(price) > 0"> - add ${{ price }}</template></label>' +
    '<div class="ml-auto">' +
    '<label v-on:click="value = (value > 0) ? value - 1 : 0" class="col-form-label px-3 float-left"><i class="fas fa-minus-square"></i></label>' +
    '<input readonly class="form-control text-center float-left form-number" type="number" min="0" v-bind:max="parseInt(scoops)" v-bind:value="value" v-bind:id="prefix + id" v-bind:data-prefix="prefix" v-bind:data-name="name" v-bind:data-price="price">' +
    '<label v-on:click="value = (value < parseInt(scoops)) ? value + 1 : parseInt(scoops)" class="col-form-label px-3 mr-2 float-left"><i class="fas fa-plus-square"></i></label>' +
    '</div>' +
    '</div>',
  methods: {
    resetValues: function() {
      Object.assign(this.$data, initValue());
    }
  }
});

Vue.component('build-vegetable-item', {
  props: ['prefix', 'id', 'name', 'price'],
  data: function() {
    return initValue();
  },
  template: '<div class="form-group row">' +
    '<label v-bind:for="prefix + id" class="col col-form-label">{{ name }}<template v-if="parseFloat(price) > 0"> - add ${{ price }}</template></label>' +
    '<div class="ml-auto">' +
    '<label v-on:click="value = (value > 0) ? value - 1 : 0" class="col-form-label px-3 float-left"><i class="fas fa-minus-square"></i></label>' +
    '<input readonly class="form-control text-center form-number float-left" type="number" min="0" max="4" v-bind:value="value" v-bind:id="prefix + id" v-bind:data-prefix="prefix" v-bind:data-name="name" v-bind:data-price="price">' +
    '<label v-on:click="value = (value < 4) ? value + 1 : 4" class="col-form-label px-3 mr-2 float-left"><i class="fas fa-plus-square"></i></label>' +
    '</div>' +
    '</div>',
  methods: {
    resetValues: function() {
      Object.assign(this.$data, initValue());
    }
  }
});

// Signature bowl components

Vue.component('signature-size-item', {
  props: ['prefix', 'id', 'name', 'price'],
  template: '<div class="custom-control custom-radio col-form-label">' +
    '  <input type="radio" class="custom-control-input" v-bind:data-prefix="prefix" v-bind:id="prefix + id" name="bowlSizes" v-bind:data-name="name" v-bind:data-price="price">' +
    '  <label class="custom-control-label w-100" v-bind:for="prefix + id">{{ name }}<template v-if="parseFloat(price) > 0"> - add ${{ price }}</template></label>' +
    '</div>'
});

Vue.component('check-item', {
  props: ['prefix', 'id', 'name', 'price'],
  template: '<div class="custom-control custom-checkbox col-form-label">' +
    '  <input type="checkbox" class="custom-control-input" v-bind:data-prefix="prefix" v-bind:id="prefix + id" v-bind:data-name="name" v-bind:data-price="price">' +
    '  <label class="custom-control-label w-100" v-bind:for="prefix + id">{{ name }}<template v-if="parseFloat(price) > 0"> - add ${{ price }}</template></label>' +
    '</div>'
});

Vue.component('empty-cart-item', {
  data: function() {
    return {
      emptyCartMessage: "Looks like your cart is empty, items added to your order will show up here."
    }
  },
  template: '<div class="center-vertical h-100 hint">{{ emptyCartMessage }}</div>'
});

Vue.component('cart-subtotal', {
  template: '<span>Subtotal: ${{ subtotal.toFixed(2) }}</span>',
  computed: {
    subtotal: function() {
      let sum = 0;
      for (let order in orderSummary.items) {
        sum += orderSummary.items[order].price * orderSummary.items[order].quantity;
      }
      return sum;
    }
  }
});

Vue.component('review-total', {
  template: '<span>Total: ${{ total.toFixed(2) }}<small> (incl. 5% GST)</small></span>',
  computed: {
    tax: function() {
      let sum = 0;
      for (let order in orderSummary.items) {
        sum += orderSummary.items[order].price * orderSummary.items[order].quantity;
      }
      sum *= 1.05; //GST
      return total;
    },
    total: function() {
      let sum = 0;
      for (let order in orderSummary.items) {
        sum += orderSummary.items[order].price * orderSummary.items[order].quantity;
      }
      sum *= 1.05; //GST
      return sum;
    }
  }
});

Vue.component('order-summary-item', {
  props: ['order', 'index'],
  template: '<div class="w-100 mx-auto py-2">' +
    '<div class="card h-100">' +
    '<div class="header text-uppercase text-center">' +
    '${{ (order.price * order.quantity).toFixed(2)}}' +
    '<button type="button" class="close mr-2" aria-label="Close" v-on:click="ordersList.splice(index, 1)">' +
    '  <span aria-hidden="true">&times;</span>' +
    '</button>' +
    '</div>' +
    '<div class="card-body text-left">' +
    '<div class="row">' +
    '<label class="col-6 mr-auto col-form-label">{{ order.name }}</label>' +
    '<label v-on:click="order.quantity = (order.quantity > 1) ? order.quantity - 1 : 1; updateCart()" class="col-form-label px-3"><i class="fas fa-minus-square"></i></label>' +
    '<input readonly class="form-control col-2 col-form-label text-center" type="number" min="1" v-on:input="order.quantity = $event.target.value; updateCart()" v-bind:value="order.quantity" v-bind:data-price="order.price">' +
    '<label v-on:click="order.quantity = order.quantity + 1; updateCart()" class="col-form-label px-3"><i class="fas fa-plus-square"></i></label>' +
    '</div>' +
    '<div class="description text-left"><slot></slot></div>' +
    '</div>' +
    '</div>' +
    '</div>',
  computed: {
    ordersList: function() {
      return orderSummary.items
    }
  },
  methods: {
    updateCart: function() {
      $.cookie("cart", JSON.stringify(orderSummary.items));
    }
  }
});

Vue.component('order-summary-details', {
  props: ['ingredients', 'name'],
  template: '<div class="order-summary-item">' +
    '<span class="pt-2 col-6 mr-auto">{{ getName(name) }}:</span>' +
    '<ul>' +
    '<li v-for="ingredient in ingredients">' +
    '<span class="col-6 mr-auto">{{ ingredient }}</span>' +
    '</li>' +
    '</ul>' +
    '</div>',
  methods: {
    getName: function(value) {
      return prefixCategoryMap[value]
    }
  }
});

Vue.component('time-estimate', {
  props: ['order', 'index'],
  template: '<h5 class="text-center hint">Estimated preparation time: {{ estimate }} mins</h5>',
  computed: {
    estimate: function() {
      let sum = 10;
      for (let order in orderSummary.items) {
        sum += orderSummary.items[order].time * orderSummary.items[order].quantity;
      }
      if (sum > 90) {
        return 90;
      }
      return sum;
    }
  }
});

Vue.component('review-order-item', {
  props: ['order', 'index'],
  template: '<div class="review-order-item py-2 row">' +
    '<h6 class="col-3 font-weight-bold">Qty: {{ order.quantity }}</h6>' +
    '<h6 class="col-9 font-weight-bold"">{{ order.name }}</h6>' +
    '<div class="text-left"><slot></slot></div>' +
    '</div>' +
    '</div>',
  computed: {
    ordersList: function() {
      return orderSummary.items
    }
  }
});

Vue.component('review-order-details', {
  props: ['ingredients', 'name'],
  template: '<div>' +
    '<span class="col-6">{{ getName(name) }}:</span>' +
    '<ul>' +
    '<li v-for="ingredient in ingredients">' +
    '<span class="col-3"></span>' +
    '<span class="col-6">{{ ingredient }}</span>' +
    '</li>' +
    '</ul>' +
    '</div>',
  methods: {
    getName: function(value) {
      return prefixCategoryMap[value]
    }
  }
});

Vue.component('review-order-button', {
  template: '<div v-if="ordersList.length > 0"><slot></slot></div>',
  computed: {
    ordersList: function() {
      return orderSummary.items
    }
  }
});

Vue.component('order-item', {
  props: ['item'],
  template: '<div class="col-lg-4 mx-0 my-lg-3 my-1 row-height-40 sr-card">' +
    '<a class="h-100" data-toggle="modal" v-bind:data-target="\'#\'+item.modalId" v-bind:onclick="\'(\'+item.clickEvent+\')(\'+JSON.stringify(item)+\');\'">' +
    '<div class="card h-100">' +
    '<div class="header text-uppercase text-center">' +
    '<template v-if="parseFloat(item.price) > 0">' +
    '${{ item.price }}</template>' +
    '</div>' +
    '<div class="card-body menu-item">' +
    '<div class="menu-thumb-container my-auto">' +
    '<template v-if="item.imageSrc"><img class="menu-thumb" v-bind:src="item.imageSrc"/></template>' +
    '<div v-else-if="item.thumbRawHtml" v-html="item.thumbRawHtml"></div>' +
    '</div>' +
    '<div class="menu-item-content">' +
    '<div class="my-2">' +
    '<div class="name">{{ item.name }}</div>' +
    '</div>' +
    '<div class="description">{{ item.description }}</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</a>' +
    '</div>'
});

var buildBase = new Vue({
  el: '#buildBaseSection',
  data: {
    items: ORDERS.buildBase,
    prefix: 'buildBase',
  }
});

var buildProteinSection = new Vue({
  el: '#buildProteinSection',
  data: {
    items: ORDERS.buildProtein,
    prefix: 'buildProtein',
    scoops: 1
  }
});

var buildVegetableSection = new Vue({
  el: '#buildVegetableSection',
  data: {
    items: ORDERS.buildVegetable,
    prefix: 'buildVegetable',
  }
});

var extraProtein = new Vue({
  el: '#buildExtraProteinSection',
  data: {
    items: ORDERS.buildExtraProtein,
    prefix: 'buildExtraProtein',
  }
});

var extraVegetables = new Vue({
  el: '#buildExtraVegetablesSection',
  data: {
    items: ORDERS.buildExtraVegetables,
    prefix: 'buildExtraVegetables',
  }
});

var sauce = new Vue({
  el: '#buildSauceSection',
  data: {
    items: ORDERS.buildSauce,
    prefix: 'buildSauce',
  }
});

var dry = new Vue({
  el: '#buildDrySection',
  data: {
    items: ORDERS.buildDry,
    prefix: 'buildDry',
  }
});

var premium = new Vue({
  el: '#buildPremiumSection',
  data: {
    items: ORDERS.buildPremium,
    prefix: 'buildPremium',
  }
});

var buildModalTitle = new Vue({
  el: '#buildModalTitle',
  data: {
    title: ''
  }
});

var buildModalPrice = new Vue({
  el: '#buildModalPrice',
  data: {
    price: ''
  }
});

var buildModalDescription = new Vue({
  el: '#buildModalDescription',
  data: {
    description: ''
  }
});

var signatureModalTitle = new Vue({
  el: '#signatureModalTitle',
  data: {
    title: ''
  }
});

var signatureModalPrice = new Vue({
  el: '#signatureModalPrice',
  data: {
    price: ''
  }
});

var signatureModalDescription = new Vue({
  el: '#signatureModalDescription',
  data: {
    description: ''
  }
});

var signatureSize = new Vue({
  el: '#signatureSizeSection',
  data: {
    items: ORDERS.signatureSize,
    prefix: 'signatureSize'
  }
});

var signatureBase = new Vue({
  el: '#signatureBaseSection',
  data: {
    items: ORDERS.signatureBase,
    prefix: 'signatureBase',
  }
});

var signatureAddOn = new Vue({
  el: '#signatureAddOnSection',
  data: {
    items: ORDERS.signatureAddOn,
    prefix: 'signatureAddOn',
  }
});

var singleItemModal = new Vue({
  el: '#singleItemModal',
  data: {
    title: '',
    price: '',
    description: '',
  }
});

const bindSignatureModal = function(item) {
  signatureModalTitle.title = item.name;
  signatureModalPrice.price = item.price;
  signatureModalDescription.description = item.description;
};

const signatureBowls = {
  // Item:
  // { name: '<name>',
  //   price: '<price>',
  //   description: '<description>',
  //   imageSrc: '<imageSrc url relative to document if using image>',
  //   thumbRawHtml: 'raw html in place of imageSrc',
  //   modalId: '<id of modal to use>',
  //   clickEvent: '<function to prepare modal>',
  // }
  items: [{
      name: 'The Red Bowl',
      description: 'Spicy tuna, spicy salmon, flying fish roe, seaweed salad, radishes, kimchi, pickled carrots, sprouts, bacon bits, seaweed flakes, and spicy sesame sauce.',
      price: '11.00',
      imageSrc: 'img/menu/red_bowl.jpg',
      modalId: 'signatureModal',
      clickEvent: bindSignatureModal
    },
    {
      name: 'The Yellow Bowl',
      description: 'Spicy salmon, scallop salad, pineapple salsa, sweet corn salad, pickled onions, sweet omelette, green onions, tempura flakes, seaweed flakes, and Pokey Okey sauce.',
      price: '11.00',
      imageSrc: 'img/menu/yellow_bowl.jpg',
      modalId: 'signatureModal',
      clickEvent: bindSignatureModal
    },
    {
      name: 'The Green Bowl',
      description: 'Tuna, salmon, capelin roe, seaweed salad, purple cabbage, soybeans, pickled onions, pickled ginger, wasabi peas, seaweed flakes, and wasabi mayo.',
      price: '11.00',
      imageSrc: 'img/menu/green_bowl.jpg',
      modalId: 'signatureModal',
      clickEvent: bindSignatureModal
    }
  ]
};

// todo
const bindBuildModal = function(item) {
  buildModalTitle.title = item.name;
  buildModalPrice.price = item.price;
  buildModalDescription.description = item.description;
  buildProteinSection.scoops = item.scoops;
};

const buildBowls = {
  // Item:
  // { name: '<name>',
  //   price: '<price>',
  //   description: '<description>',
  //   imageSrc: '<imageSrc url relative to document if using image>',
  //   thumbRawHtml: 'raw html in place of imageSrc',
  //   modalId: '<id of modal to use>',
  //   clickEvent: '<function to prepare modal>',
  // }
  items: [{
      name: 'Small Build-A-Bowl (1 Protein)',
      description: '1 scoop of protein and 4 vegetables',
      price: '10.00',
      thumbRawHtml: '<i class="fas fa-utensil-spoon text-dark-gray" aria-hidden="true"></i>',
      modalId: 'buildModal',
      scoops: '1',
      clickEvent: bindBuildModal
    },
    {
      name: 'Medium Build-A-Bowl (2 Proteins)',
      description: '2 scoops of protein and 4 vegetables',
      price: '12.50',
      thumbRawHtml: '<i class="fas fa-utensil-spoon text-dark-gray d-block" aria-hidden="true"></i>' +
        '<i class="fas fa-utensil-spoon text-dark-gray d-block" aria-hidden="true"></i>',
      modalId: 'buildModal',
      scoops: '2',
      clickEvent: bindBuildModal
    },
    {
      name: 'Large Build-A-Bowl (3 Proteins)',
      description: '3 scoops of protein and 4 vegetables',
      price: '15.00',
      thumbRawHtml: '<i class="fas fa-utensil-spoon text-dark-gray d-block" aria-hidden="true"></i>' +
        '<i class="fas fa-utensil-spoon text-dark-gray d-block" aria-hidden="true"></i>' +
        '<i class="fas fa-utensil-spoon text-dark-gray d-block" aria-hidden="true"></i>',
      modalId: 'buildModal',
      scoops: '3',
      clickEvent: bindBuildModal
    }
  ]
};

const bindSingleItemModal = function(item) {
  singleItemModal.title = item.name;
  singleItemModal.price = item.price;
  singleItemModal.description = item.description;
};

const drinks = {
  items: [{
      name: 'Bubly Lime',
      description: '355mL',
      price: '1.50',
      modalId: 'singleItemModal',
      clickEvent: bindSingleItemModal
    },
    {
      name: 'Lemon Lemon',
      description: '355mL',
      price: '1.50',
      modalId: 'singleItemModal',
      clickEvent: bindSingleItemModal
    },
    {
      name: 'Spring Water',
      description: '500mL',
      price: '2.00',
      modalId: 'singleItemModal',
      clickEvent: bindSingleItemModal
    },
    {
      name: 'Sparkling Water',
      description: '500mL',
      price: '2.00',
      modalId: 'singleItemModal',
      clickEvent: bindSingleItemModal
    },
    {
      name: 'Calpico (Can)',
      description: '355mL',
      price: '2.50',
      modalId: 'singleItemModal',
      clickEvent: bindSingleItemModal
    },
    {
      name: 'Calpico White Peach',
      description: '500mL',
      price: '3.00',
      modalId: 'singleItemModal',
      clickEvent: bindSingleItemModal
    },
    {
      name: 'Coconut Water',
      description: '500mL',
      price: '3.00',
      modalId: 'singleItemModal',
      clickEvent: bindSingleItemModal
    }
  ]
}

var signatureBowlOrderMenu = new Vue({
  el: '#signatureBowlOrderMenu',
  data: function() {
    return {
      signatureBowls
    }
  },
  computed: {
    items: function() {
      return signatureBowls.items
    }
  }
});

var buildBowlOrderMenu = new Vue({
  el: '#buildBowlOrderMenu',
  data: function() {
    return {
      buildBowls
    }
  },
  computed: {
    items: function() {
      return buildBowls.items
    }
  }
});

var drinksOrderMenu = new Vue({
  el: '#drinksOrderMenu',
  data: function() {
    return {
      drinks
    }
  },
  computed: {
    items: function() {
      return drinks.items
    }
  }
});

const prefixCategoryMap = {
  buildBase: 'Base',
  buildProtein: 'Protein',
  buildExtraProtein: 'Extra Protein',
  buildVegetable: 'Vegetables',
  buildExtraVegetables: 'Extra Vegetables',
  buildSauce: 'Sauce',
  buildDry: 'Dry Toppings',
  buildPremium: 'Premium Toppings',
  signatureSize: 'Size',
  signatureBase: 'Base',
  signatureAddOn: 'Add On',
  signatureAddExtra: 'Add Extra',
  comment: 'Comments'
};

function getCart() {
  let savedOrder = $.cookie("cart");
  if (savedOrder) {
    return JSON.parse(savedOrder);
  }
  return [];
}

var orderSummary = new Vue({
  el: '#orderSummary',
  data: {
    items: getCart()
  },
  watch: {
    items: function(val) {
      $.cookie("cart", JSON.stringify(val));
    }
  }
});

var cart = new Vue({
  el: '#cartSubtotal'
});

var mobileFooter = new Vue({
  el: '#mobileFooter',
  computed: {
    items: function() {
      return orderSummary.items;
    }
  }
});

var reviewOrderSummary = new Vue({
  el: '#reviewOrderSummary',
  computed: {
    items: function() {
      return orderSummary.items;
    }
  }
});

var reviewOrderButton = new Vue({
  el: ".cart-footer"
})

function submitSingleItemModal() {
  parseModal('singleItem');
  $('#singleItemModal').modal('hide');
}

function validateBuildModal() {
  var valid = true;

  //Validate base
  var base_ = 0;
  $("input[id^=buildBase]").each((o, c) => {
    if ($(c).is(':checked')) {
      base_++;
    }
  });

  if (base_ == 0) {
    $('#buildBaseSection').addClass('form-invalid');
    valid = false;
  } else {
    $('#buildBaseSection').removeClass('form-invalid');
  }

  //Validate protein
  var protein_ = 0;
  $("input[id^=buildProtein]").each((o, c) => {
    protein_ += parseInt($(c).val());
  });

  if (protein_ != buildProteinSection.scoops) {
    $('#buildProteinSection').addClass('form-invalid');
    valid = false;
  } else {
    $('#buildProteinSection').removeClass('form-invalid');
  }

  //Validate vegetables
  var vegetables_ = 0;
  $("input[id^=buildVegetable]").each((o, c) => {
    vegetables_ += parseInt($(c).val());
  });

  if (vegetables_ != 4) {
    $('#buildVegetableSection').addClass('form-invalid');
    valid = false;
  } else {
    $('#buildVegetableSection').removeClass('form-invalid');
  }

  if (base_ == 0) {
    $('#buildBaseSection').addClass('form-invalid');
    $('#buildModal .modal-body').animate({
      scrollTop: ($('#buildModal .modal-body').scrollTop() + $('#buildBaseSection').position().top - 16)
    }, 1000, "easeInOutExpo");
  } else if (protein_ != buildProteinSection.scoops) {
    $('#buildProteinSection').addClass('form-invalid');
    $('#buildModal .modal-body').animate({
      scrollTop: ($('#buildModal .modal-body').scrollTop() + $('#buildProteinSection').position().top - 16)
    }, 1000, "easeInOutExpo");
  } else if (vegetables_ != 4) {
    $('#buildVegetableSection').addClass('form-invalid');
    $('#buildModal .modal-body').animate({
      scrollTop: ($('#buildModal .modal-body').scrollTop() + $('#buildVegetableSection').position().top - 16)
    }, 1000, "easeInOutExpo");
  }

  if (!valid) {
    $('#buildModalSubmit').addClass('form-invalid');
  } else {
    $('#buildModalSubmit').removeClass('form-invalid');
  }

  return valid;
}

function submitBuildModal() {
  if (validateBuildModal()) {
    parseModal('build');
    $('#buildModal').modal('hide');
  }
}

function submitSignatureModal() {
  if (validateSignatureModal()) {
    parseModal('signature');
    $('#signatureModal').modal('hide');
  }
}

function validateSignatureModal() {
  var valid = true;

  //Validate size
  var size_ = 0;
  $("input[id^=signatureSize]").each((o, c) => {
    if ($(c).is(':checked')) {
      size_++;
    }
  });

  if (size_ == 0) {
    $('#signatureSizeSection').addClass('form-invalid');
    valid = false;
  } else {
    $('#signatureSizeSection').removeClass('form-invalid');
  }

  //Validate base
  var base_ = 0;
  $("input[id^=signatureBase]").each((o, c) => {
    if ($(c).is(':checked')) {
      base_++;
    }
  });

  if (base_ == 0) {
    $('#signatureBaseSection').addClass('form-invalid');
    valid = false;
  } else {
    $('#signatureBaseSection').removeClass('form-invalid');
  }

  if (!valid) {
    $('#signatureModalSubmit').addClass('form-invalid');
  } else {
    $('#signatureModalSubmit').removeClass('form-invalid');
  }

  if (size_ == 0) {
    $('#signatureSizeSection').addClass('form-invalid');
    $('#signatureModal .modal-body').animate({
      scrollTop: ($('#signatureModal .modal-body').scrollTop() + $('#signatureSizeSection').position().top - 16)
    }, 1000, "easeInOutExpo");
  } else if (base_ == 0) {
    $('#signatureBaseSection').addClass('form-invalid');
    $('#signatureModal .modal-body').animate({
      scrollTop: ($('#signatureModal .modal-body').scrollTop() + $('#signatureBaseSection').position().top - 16)
    }, 1000, "easeInOutExpo");
  }
  return valid;
}

$('#buildModal').on('show.bs.modal', function() {
  resetBuildModal();
});

$('#signatureModal').on('show.bs.modal', function() {
  resetSignatureModal();
});

$('#singleItemModal').on('show.bs.modal', function() {
  resetSingleItemModal();
});

var setBodyUnscrollable = function() {
  $('body.modal-open').css("height", $.windowHeight("visual") + "px");
};

$('#buildModal').on('shown.bs.modal', setBodyUnscrollable);
$('#signatureModal').on('shown.bs.modal', setBodyUnscrollable);
$('#singleItemModal').on('shown.bs.modal', setBodyUnscrollable);

$('#buildModal').on('hide.bs.modal', function() {
  $('#buildModal .modal-body').scrollTop("0");
});

$('#signatureModal').on('hide.bs.modal', function() {
  $('#signatureModal .modal-body').scrollTop("0");
});

$('#singleItemModal').on('hide.bs.modal', function() {
  $('#singleItemModal .modal-body').scrollTop("0");
});

function resetSignatureModal() {

  $('input[id^=signature]').prop('checked', false);
  $('div[id^=signature]').removeClass('form-invalid');
  $('button[id^=signature]').removeClass('form-invalid');
  $('textarea[id^=signature]').val('');
}

function resetBuildModal() {
  for (let i in buildVegetableSection.$refs.items) {
    buildVegetableSection.$refs.items[i].resetValues();
  }
  for (let i in buildProteinSection.$refs.items) {
    buildProteinSection.$refs.items[i].resetValues();
  }
  $('input[id^=build]').prop('checked', false);
  $('div[id^=build]').removeClass('form-invalid');
  $('button[id^=build]').removeClass('form-invalid');
  $('textarea[id^=build]').val('');
}

function resetSingleItemModal() {
  $('textarea[id^=singleItem]').val('');
}

function insertOrderItem(name_, price_, details_, prep_, time_, hash_) {
  for (let order in orderSummary.items) {
    if (hash_ == orderSummary.items[order].hash) {
      orderSummary.items[order].quantity += 1;
      return;
    }
  }
  orderSummary.items.push({
    name: name_,
    price: price_,
    details: details_,
    prep: prep_,
    quantity: 1,
    time: time_,
    hash: hash_
  });
}

function parseModal(prefix) {
  let name;
  let price = parseFloat($('#' + prefix + 'ModalPrice').attr('data-price'));
  name = $('#' + prefix + 'ModalTitle').text();
  let detailsMap = {};
  let prep = [];
  let hash = '';
  let time = 0;

  $('input[id^=' + prefix + ']').each((o, c) => {
    if ($(c).is(':checked')) {
      price += parseFloat($(c).attr('data-price'));
      if (!detailsMap[$(c).attr('data-prefix')]) {
        detailsMap[$(c).attr('data-prefix')] = [];
      }
      detailsMap[$(c).attr('data-prefix')].push($(c).attr('data-name'));

      let id = $(c).attr('id');
      let prefix = $(c).attr('data-prefix');
      let prepName = id.substring(prefix.length, id.length);
      prep.push(prepName);
    } else if ($(c).val() > 0) {
      price += parseFloat($(c).attr('data-price')) * $(c).val();
      if (!detailsMap[$(c).attr('data-prefix')]) {
        detailsMap[$(c).attr('data-prefix')] = [];
      }
      let id = $(c).attr('id');
      let prefix = $(c).attr('data-prefix');
      let prepName = id.substring(prefix.length, id.length);
      for (let i = 0; i < $(c).val(); i++) {
        prep.push(prepName);
      }
      detailsMap[$(c).attr('data-prefix')].push($(c).val() + ' - ' + $(c).attr('data-name'));
    }
  });
  let comments = $('textarea[id^=' + prefix + 'ModalComments]').val();
  if (comments) {
    detailsMap.comment = [comments];
  }

  hash = computeHash(name + JSON.stringify(detailsMap));
  if (prefix == 'signature') {
    time = 4;
  } else if (prefix == 'build') {
    time = 6;
  }
  insertOrderItem(name, price, detailsMap, prep, time, hash);
}

function computeHash(value) {
  var hash = 0;
  if (value.length == 0) {
    return hash;
  }
  for (var i = 0; i < value.length; i++) {
    var char = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function toggleCart() {
  $('#cart .cart-body').css("height", "calc(" + $.windowHeight("visual") + "px - 12rem)");
  $('#cart').toggleClass('open');
  $('body').toggleClass('cart-open');
}

$(window).on('resize', function() {
  $('body.modal-open').css("height", $.windowHeight("visual") + "px");
  $('#cart.open').css("height", $.windowHeight("visual") + "px");
  $('#cart.open .cart-body').css("height", "calc(" + $.windowHeight("visual") + "px - 12rem)");
  $('#body.cart-open').css("height", $.windowHeight("visual") + "px");
});

function onSuccessfulSubmit(data, text, xhr) {
  $.removeCookie('cart', {
    path: '/'
  });
  window.location.replace("confirm.html");
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateSubmit() {
  var valid = true;

  var name = $("#submitOrderModalName").val();
  if (name.length < 1) {
    $(".submitOrderModalNameLabel").addClass('form-invalid');
    valid = false;
  } else {
    $(".submitOrderModalNameLabel").removeClass('form-invalid');
  }

  var email = $("#submitOrderModalEmail").val();
  if (!validateEmail(email)) {
    $(".submitOrderModalEmailLabel").addClass('form-invalid');
    valid = false;
  } else {
    $(".submitOrderModalEmailLabel").removeClass('form-invalid');
  }

  if ($("#submitOrderModalSMS").is(":checked")) {
    var phone = $("#submitOrderModalPhone").val().replace(/\s/g, '');
    if (phone.length != 10) {
      $(".submitOrderModalPhoneLabel").addClass('form-invalid');
      valid = false;
    } else {
      $(".submitOrderModalPhoneLabel").removeClass('form-invalid');
    }
  }

  if (!valid) {
    $("#orderSubmit").addClass('form-invalid');
  } else {
    $("#orderSubmit").removeClass('form-invalid');
  }
  return valid;
}

function submitOrder() {
  if (!validateSubmit()) {
    return;
  }
  $("#submitOrderModal .modal-content.loading").show();
  var name = $("#submitOrderModalName").val();
  var email = $("#submitOrderModalEmail").val();
  var phone = $("#submitOrderModalPhone").val().replace(/\s/g, '');
  var sms = $("#submitOrderModalSMS").is(":checked");
  var comments = $("#submitOrderModalComments").val();
  var items = JSON.stringify(orderSummary.items);
  var key = String.fromCharCode(121, 111, 103, 117, 116, 104, 101, 102, 101, 101, 100, 101, 114);
  var itemsEncrypted = CryptoJS.AES.encrypt(items, key).toString();
  var order = {
    name: name,
    email: email,
    phone: phone,
    sms: sms,
    comments: comments,
    items: itemsEncrypted
  };
  $.ajax({
    url: "https://cnifdxegb9.execute-api.us-west-2.amazonaws.com/prod/submitOrder",
    type: "POST",
    data: JSON.stringify(order),
    contentType: "application/json",
    success: onSuccessfulSubmit
  });
}


document.getElementById('stripeCheckout').addEventListener('click', function(e) {
  if (!validateSubmit()) {
    return;
  }
  $("#submitOrderModal .modal-content.loading").show();
  var name = $("#submitOrderModalName").val();
  var email = $("#submitOrderModalEmail").val();
  var phone = $("#submitOrderModalPhone").val().replace(/\s/g, '');
  var sms = $("#submitOrderModalSMS").is(":checked");
  var comments = $("#submitOrderModalComments").val();
  var items = JSON.stringify(orderSummary.items);
  var key = String.fromCharCode(121, 111, 103, 117, 116, 104, 101, 102, 101, 101, 100, 101, 114);
  var itemsEncrypted = CryptoJS.AES.encrypt(items, key).toString();
  var order = {
    name: name,
    email: email,
    phone: phone,
    sms: sms,
    comments: comments,
    items: itemsEncrypted
  };
  var total = 0;
  var quantity = 0;
  for (let item in orderSummary.items) {
    total += orderSummary.items[item].price * orderSummary.items[item].quantity;
    quantity += orderSummary.items[item].quantity;
  }
  total *= 100;
  total *= 1.05;
  var email = $("#submitOrderModalEmail").val();

  var handler = StripeCheckout.configure({
    key: 'pk_test_TjXurwG2CPkzfQJKpogHYqCX',
    image: 'https://new.pokeyokey.com/img/favicon.png',
    locale: 'auto',
    token: function(token) {
      order["token"] = token.id;
      console.log(token);
      $.ajax({
        url: "https://cnifdxegb9.execute-api.us-west-2.amazonaws.com/prod/createPayment",
        type: "POST",
        data: JSON.stringify(order),
        contentType: "application/json",
        // success: onSuccessfulSubmit
      });
      $("#submitOrderModal .modal-content.loading").show();
    }
  });
  // Open Checkout with further options:
  handler.open({
    name: 'Pokey Okey',
    description: quantity + ' items',
    currency: 'cad',
    email: email,
    amount: total
  });
  e.preventDefault();
});

// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
  handler.close();
});