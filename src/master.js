class Game {
    constructor(ryan, map, scoreNode, opt) {
        this.ryan = ryan
        this.map = map
        this.scoreNode = scoreNode
        this.score = 0
        this.obstacles = []
        this.status = 'wait'
        this.opt = opt
    }
    setScore(score) {
        this.scoreNode.innerText = score
    }
    start() {
        this.status = 'running'
        this.score = 0
        this.obstacles = []
        this.map.innerHTML = ''
        this.session = setInterval(()=>{this.setScore(this.score++)},100)
        this.addObstacle = setInterval(()=>{
            this.obstacles.push(
                new Obstacle(this.map, this, this.ryan, this.opt)
            )
        }, this.opt.OBSTACLE_CYCLE)
        
    }
    stop() {
        this.status = 'wait'
        clearInterval(this.session)
        clearInterval(this.addObstacle)
        this.obstacles.forEach(obs => {
            obs.action.pause()
        });
    }
}
class Ryan {
    constructor(target) {
        this.target = target
        this.offsetTop = target.offsetTop
    }
    rolling(speed, time) {
        if(time == 0) return;
        this.action = this.target.animate([
            {transform: 'rotate(0deg)'},
            {transform: 'rotate(360deg)'}
        ], speed);    
        this.action.addEventListener('finish', ()=>this.rolling(speed, --time));
    }
    jump(speed, height) {
        this.action = this.target.animate([
            {top: '50%'},
            {top: `${height}%`},
            {top: '50%'}
        ], speed)
    }
}
class Obstacle {
    constructor(map, game, ryan, opt) {
        this.map = map
        this.game = game
        this.ryan = ryan
        this.speed = opt.OBSTACLE_SPEED || 1000
        this.obstacle = document.createElement('div')
        this.obstacle.className = 'obstacle'
        this.setCharacter()
        this.appendMap()
    }
    setCharacter() {
        const obstacleObject = [
            {
                name: 'dog1',
                url: './img/dog2.png'
            },
            {
                name: 'dog2',
                url: './img/dog3.png'
            }
        ]
        const random = Math.floor(Math.random() * 10) % 2
        this.obstacle.style.backgroundImage = `url(${obstacleObject[random].url})`
    }
    move(speed) {
        this.action = this.obstacle.animate([
            {right: '20px'},
            {right: '100%'}
        ], speed)
        const trackingLister = setInterval(()=>{
            const x = this.obstacle.offsetLeft
            const y = this.obstacle.offsetTop

            const r_x = this.ryan.target.offsetLeft
            const r_y = this.ryan.target.offsetTop
            
            if(Math.abs(x - r_x) < 10 && Math.abs(y - r_y) < 10)     
                this.game.stop()
        }, 10)
        this.action.addEventListener('finish', () => {
            this.obstacle.remove()
            this.game.obstacles.shift()
            clearInterval(trackingLister)
        })
    }
    appendMap() {
        this.map.appendChild(this.obstacle)
        this.move(this.speed)
    }
    
}