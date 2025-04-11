const Example = require('../models/ExampleModel');

exports.getExamples = async (req, res, next) => {
  try {
    const examples = await Example.find();
    res.status(200).json({ success: true, count: examples.length, data: examples });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};


exports.createExample = async (req, res, next) => {
  try {
    const example = await Example.create(req.body);
    res.status(201).json({ success: true, data: example });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};