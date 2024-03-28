const MODEL_NAME = "userModel";
const db = require("./../model/index");
const Model = db[MODEL_NAME];
const Op = db.Sequelize.Op;

/**
 * 注册用户
 * @param {*} req
 * @param {*} res
 * @returns 
 */
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "内容不能为空"
    });
    return;
  }

  // 创建一条清单
  const todo = {
    title: req.body.title,
    description: req.body.description,
    stauts: req.body.stauts ? req.body.stauts : false
  };

  // 将清单保存到数据库
  Todo.create(todo)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "创建清单是发生错误。"
      });
    });
};

// 从数据库中搜索.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Todo.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "搜索时，发生错误。"
      });
    });
};

// 按照条目 ID 搜索
exports.findOne = (req, res) => {
  const id = req.params.id;

  Todo.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `没有找到 ${id} 的清单`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:  `查询第 ${id} 条清单时出错`
      });
    });
};

// 更新指定 ID 清单
exports.update = (req, res) => {
  const id = req.params.id;

  Todo.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "更新成功"
        });
      } else {
        res.send({
          message: `第 ${id} 条更新失败。`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `更新第 ${id} 条清单时出错`
      });
    });
};

// Delete a Todo with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Todo.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "删除成功"
        });
      } else {
        res.send({
          message: `删除第${id}条清单失败。`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "不能删除清单：" + id
      });
    });
};

// 删除数据库中所有清单
exports.deleteAll = (req, res) => {
  Todo.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `删除${nums}条清单 ` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "删除所有清单时出错"
      });
    });
};

// 检查所有清单状态
exports.findAllstauts = (req, res) => {
  Todo.findAll({ where: { stauts: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "搜索清单时出错"
      });
    });
};
