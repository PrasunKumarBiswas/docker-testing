"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _utils = require("../utils");
var _orderModel = _interopRequireDefault(require("../models/orderModel"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const orderRouter = _express.default.Router();
orderRouter.get('/summary', _utils.isAuth, _utils.isAdmin, (0, _expressAsyncHandler.default)(async (req, res) => {
  const orders = await _orderModel.default.aggregate([{
    $group: {
      _id: null,
      numOrders: {
        $sum: 1
      },
      totalSales: {
        $sum: '$totalPrice'
      }
    }
  }]);
  const users = await User.aggregate([{
    $group: {
      _id: null,
      numUsers: {
        $sum: 1
      }
    }
  }]);
  const dailyOrders = await _orderModel.default.aggregate([{
    $group: {
      _id: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$createdAt'
        }
      },
      orders: {
        $sum: 1
      },
      sales: {
        $sum: '$totalPrice'
      }
    }
  }]);
  const productCategories = await Product.aggregate([{
    $group: {
      _id: '$category',
      count: {
        $sum: 1
      }
    }
  }]);
  res.send({
    users,
    orders: orders.length === 0 ? [{
      numOrders: 0,
      totalSales: 0
    }] : orders,
    dailyOrders,
    productCategories
  });
}));
orderRouter.get('/', _utils.isAuth, _utils.isAdmin, (0, _expressAsyncHandler.default)(async (req, res) => {
  const orders = await _orderModel.default.find({}).populate('user');
  res.send(orders);
}));
orderRouter.get('/mine', _utils.isAuth, (0, _expressAsyncHandler.default)(async (req, res) => {
  const orders = await _orderModel.default.find({
    user: req.user._id
  });
  res.send(orders);
}));
orderRouter.get('/:id', _utils.isAuth, (0, _expressAsyncHandler.default)(async (req, res) => {
  const order = await _orderModel.default.findById(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({
      message: 'Order Not Found'
    });
  }
}));
orderRouter.post('/', _utils.isAuth, (0, _expressAsyncHandler.default)(async (req, res) => {
  const order = new _orderModel.default({
    orderItems: req.body.orderItems,
    user: req.user._id,
    shipping: req.body.shipping,
    payment: req.body.payment,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice
  });
  const createdOrder = await order.save();
  res.status(201).send({
    message: 'New Order Created',
    order: createdOrder
  });
}));
orderRouter.delete('/:id', _utils.isAuth, _utils.isAdmin, (0, _expressAsyncHandler.default)(async (req, res) => {
  const order = await _orderModel.default.findById(req.params.id);
  if (order) {
    const deletedOrder = await order.remove();
    res.send({
      message: 'Order Deleted',
      product: deletedOrder
    });
  } else {
    res.status(404).send({
      message: 'Order Not Found'
    });
  }
}));
orderRouter.put('/:id/pay', _utils.isAuth, (0, _expressAsyncHandler.default)(async (req, res) => {
  const order = await _orderModel.default.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.payment.paymentResult = {
      payerID: req.body.payerID,
      paymentID: req.body.paymentID,
      orderID: req.body.orderID
    };
    const updatedOrder = await order.save();
    res.send({
      message: 'Order Paid',
      order: updatedOrder
    });
  } else {
    res.status(404).send({
      message: 'Order Not Found.'
    });
  }
}));
orderRouter.put('/:id/deliver', _utils.isAuth, (0, _expressAsyncHandler.default)(async (req, res) => {
  const order = await _orderModel.default.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.send({
      message: 'Order Delivered',
      order: updatedOrder
    });
  } else {
    res.status(404).send({
      message: 'Order Not Found.'
    });
  }
}));
var _default = orderRouter;
exports.default = _default;