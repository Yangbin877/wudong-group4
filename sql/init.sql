CREATE DATABASE IF NOT EXISTS wudong_group4 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wudong_group4;

DROP TABLE IF EXISTS ticket_inventory;
DROP TABLE IF EXISTS electronic_ticket;
DROP TABLE IF EXISTS route_itinerary;
DROP TABLE IF EXISTS route_package;
DROP TABLE IF EXISTS ticket_type;
DROP TABLE IF EXISTS scenic_spot;
DROP TABLE IF EXISTS admin_user;

CREATE TABLE scenic_spot (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '景区名称',
  description TEXT COMMENT '景区介绍',
  location VARCHAR(255) COMMENT '地址',
  images JSON COMMENT '图片列表',
  rating DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
  open_time VARCHAR(100) COMMENT '开放时间',
  tips TEXT COMMENT '游玩贴士',
  is_deleted TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='景区表';

CREATE TABLE ticket_type (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  scenic_spot_id BIGINT UNSIGNED NOT NULL COMMENT '景区ID',
  name VARCHAR(100) NOT NULL COMMENT '票种名称，如成人票、学生票',
  description TEXT COMMENT '票种说明',
  price DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '单价',
  validity_days INT NOT NULL DEFAULT 1 COMMENT '购票后N天内有效',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '0下架 1在售',
  is_deleted TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_scenic_spot (scenic_spot_id),
  KEY idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='票种表';

CREATE TABLE route_package (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL COMMENT '套餐名称',
  description TEXT COMMENT '套餐介绍',
  cover_image VARCHAR(500) COMMENT '封面图',
  price DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '套餐价格',
  days INT NOT NULL DEFAULT 1 COMMENT '行程天数',
  tags JSON COMMENT '标签',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '0下架 1在售',
  is_deleted TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线套餐表';

CREATE TABLE route_itinerary (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  route_package_id BIGINT UNSIGNED NOT NULL COMMENT '路线套餐ID',
  day_no INT NOT NULL COMMENT '第几天',
  title VARCHAR(200) NOT NULL COMMENT '当天标题',
  description TEXT COMMENT '当天安排',
  scenic_spot_ids JSON COMMENT '当天游览景区ID列表',
  meals VARCHAR(255) COMMENT '餐饮安排',
  accommodation VARCHAR(255) COMMENT '住宿安排',
  is_deleted TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_route_package (route_package_id),
  KEY idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线行程表';

CREATE TABLE electronic_ticket (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_type_id BIGINT UNSIGNED COMMENT '票种ID',
  route_package_id BIGINT UNSIGNED COMMENT '路线套餐ID',
  user_id BIGINT UNSIGNED DEFAULT 0 COMMENT '用户ID（占位）',
  order_no VARCHAR(64) COMMENT '订单号',
  qr_code VARCHAR(64) NOT NULL COMMENT '唯一二维码UUID',
  status TINYINT NOT NULL DEFAULT 0 COMMENT '0未使用 1已使用 2已过期 3已退款',
  valid_start DATE COMMENT '有效开始日期',
  valid_end DATE COMMENT '有效结束日期',
  used_at DATETIME COMMENT '核销时间',
  price DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '实际售价',
  quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
  is_deleted TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_qr_code (qr_code),
  KEY idx_ticket_type (ticket_type_id),
  KEY idx_route_package (route_package_id),
  KEY idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='电子票表';

CREATE TABLE ticket_inventory (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_type_id BIGINT UNSIGNED NOT NULL COMMENT '票种ID',
  inventory_date DATE NOT NULL COMMENT '日期',
  stock INT NOT NULL DEFAULT 0 COMMENT '可售库存',
  sold INT NOT NULL DEFAULT 0 COMMENT '已售数量',
  is_deleted TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ticket_date (ticket_type_id, inventory_date),
  KEY idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='票种日库存表';

-- 已将nickname扩容为VARCHAR(100)，彻底解决中文超长报错
CREATE TABLE admin_user (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '加密密码',
  nickname VARCHAR(100) COMMENT '昵称',
  role VARCHAR(20) DEFAULT 'admin' COMMENT '角色',
  is_deleted TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_username (username),
  KEY idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- 初始化管理员账号 admin / 123456
INSERT INTO admin_user (username, password, nickname, role)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5qPRn5gBJri', '管理员', 'admin');

-- 初始化示例景区
INSERT INTO scenic_spot (name, description, location, images, rating, open_time, tips) VALUES
('西江千户苗寨', '世界上最大的苗族聚居村寨，苗族文化露天博物馆。', '贵州省黔东南苗族侗族自治州雷山县', '["https://example.com/xj1.jpg"]', 4.8, '08:00-22:00', '建议穿舒适运动鞋，夜间观景台很冷。'),
('乌东苗寨', '保存完好的原生态苗族村寨，体验传统农耕与苗家生活。', '贵州省黔东南州雷山县丹江镇乌东村', '["https://example.com/wd1.jpg"]', 4.6, '09:00-18:00', '村道较陡，建议轻装出行。'),
('雷公山国家森林公园', '黔东南第一高峰，原始森林与云海奇观。', '贵州省黔东南州雷山县', '["https://example.com/lgs1.jpg"]', 4.7, '08:30-17:30', '山路弯多，注意安全。');

-- 初始化示例票种
INSERT INTO ticket_type (scenic_spot_id, name, description, price, validity_days, status) VALUES
(1, '成人票', '西江千户苗寨成人门票', 90.00, 1, 1),
(1, '学生票', '凭有效学生证购买', 45.00, 1, 1),
(2, '乌东苗寨门票', '含导览讲解', 60.00, 1, 1),
(3, '雷公山门票', '森林公园大门票', 50.00, 1, 1);

-- 初始化示例路线套餐
INSERT INTO route_package (name, description, cover_image, price, days, tags, status) VALUES
('苗乡两日游', '西江千户苗寨+乌东苗寨深度体验，含一晚特色民宿。', 'https://example.com/p1.jpg', 399.00, 2, '["苗寨","两日游","含住宿"]', 1),
('雷公山探秘三日游', '原始森林徒步、云海日出、苗家拦门酒。', 'https://example.com/p2.jpg', 899.00, 3, '["徒步","云海","三日游"]', 1);

-- 初始化示例行程
INSERT INTO route_itinerary (route_package_id, day_no, title, description, scenic_spot_ids, meals, accommodation) VALUES
(1, 1, '抵达西江千户苗寨', '白天游览苗寨古街，晚上登顶观景台欣赏万家灯火。', '[1]', '长桌宴', '西江特色民宿'),
(1, 2, '乌东原生态体验', '上午前往乌东苗寨，体验稻田抓鱼、苗家蜡染。', '[2]', '苗家酸汤鱼', '返程'),
(2, 1, '雷公山登山', '沿原始森林步道攀登，傍晚观云海日落。', '[3]', '路餐', '山顶客栈'),
(2, 2, '日出与苗族文化', '清晨拍摄日出，下午学习苗族歌舞。', '[3]', '农家菜', '雷山县城酒店'),
(2, 3, '返程', '购买伴手礼后返程。', '[]', '早午餐', '无');

-- 初始化未来7天库存
INSERT INTO ticket_inventory (ticket_type_id, inventory_date, stock, sold)
SELECT id, DATE_ADD(CURDATE(), INTERVAL n DAY), 100, 0
FROM ticket_type CROSS JOIN (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) days;