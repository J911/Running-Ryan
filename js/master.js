'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game(ryan, map, scoreNode, opt) {
        _classCallCheck(this, Game);

        this.ryan = ryan;
        this.map = map;
        this.scoreNode = scoreNode;
        this.score = 0;
        this.obstacles = [];
        this.status = 'wait';
        this.opt = opt;
    }

    _createClass(Game, [{
        key: 'setScore',
        value: function setScore(score) {
            this.scoreNode.innerText = score;
        }
    }, {
        key: 'start',
        value: function start() {
            var _this = this;

            this.status = 'running';
            this.score = 0;
            this.obstacles = [];
            this.map.innerHTML = '';
            this.session = setInterval(function () {
                _this.setScore(_this.score++);
            }, 100);
            this.addObstacle = setInterval(function () {
                _this.obstacles.push(new Obstacle(_this.map, _this, _this.ryan, _this.opt));
            }, _this.opt.OBSTACLE_CYCLE || 3000);
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.status = 'wait';
            clearInterval(this.session);
            clearInterval(this.addObstacle);
            this.obstacles.forEach(function (obs) {
                obs.action.pause();
            });
        }
    }]);

    return Game;
}();

var Ryan = function () {
    function Ryan(target) {
        _classCallCheck(this, Ryan);

        this.target = target;
        this.offsetTop = target.offsetTop;
    }

    _createClass(Ryan, [{
        key: 'rolling',
        value: function rolling(speed, time) {
            var _this2 = this;

            if (time == 0) return;
            this.action = this.target.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], speed);
            this.action.addEventListener('finish', function () {
                return _this2.rolling(speed, --time);
            });
        }
    }, {
        key: 'jump',
        value: function jump(speed, height) {
            this.action = this.target.animate([{ top: '50%' }, { top: height + '%' }, { top: '50%' }], speed);
        }
    }]);

    return Ryan;
}();

var Obstacle = function () {
    function Obstacle(map, game, ryan, opt) {
        _classCallCheck(this, Obstacle);

        this.map = map;
        this.game = game;
        this.ryan = ryan;
        this.speed = opt.OBSTACLE_SPEED || 1000;
        this.obstacle = document.createElement('div');
        this.obstacle.className = 'obstacle';
        this.setCharacter();
        this.appendMap();
    }

    _createClass(Obstacle, [{
        key: 'setCharacter',
        value: function setCharacter() {
            var obstacleObject = [{
                name: 'dog1',
                url: './img/dog2.png'
            }, {
                name: 'dog2',
                url: './img/dog3.png'
            }];
            var random = Math.floor(Math.random() * 10) % 2;
            this.obstacle.style.backgroundImage = 'url(' + obstacleObject[random].url + ')';
        }
    }, {
        key: 'move',
        value: function move(speed) {
            var _this3 = this;

            this.action = this.obstacle.animate([{ right: '20px' }, { right: '100%' }], speed);
            var trackingLister = setInterval(function () {
                var x = _this3.obstacle.offsetLeft;
                var y = _this3.obstacle.offsetTop;

                var r_x = _this3.ryan.target.offsetLeft;
                var r_y = _this3.ryan.target.offsetTop;
                
                if (Math.abs(x - r_x) < 10 && Math.abs(y - r_y) < 10) _this3.game.stop();
            }, 10);
            this.action.addEventListener('finish', function () {
                _this3.obstacle.remove();
                _this3.game.obstacles.shift();
                clearInterval(trackingLister);
            });
        }
    }, {
        key: 'appendMap',
        value: function appendMap() {
            this.map.appendChild(this.obstacle);
            this.move(this.speed);
        }
    }]);

    return Obstacle;
}();