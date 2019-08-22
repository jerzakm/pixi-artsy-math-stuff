import { Container, Graphics } from "pixi.js";
import { Point, findPointWithAngle } from "../math/coordMath";

export class RadarFragment extends Container{
    radius: number
    fragments: number
    g: Graphics
    center: Point    
    segments: IRadarSegment[]
    angleGoal: number

    constructor(radius: number, fragments: number){
        super()
        this.radius = radius
        this.fragments = fragments
        this.segments = []
        this.g = new Graphics()
        this.addChild(this.g)
        this.center = {x: radius, y: radius}
        this.angleGoal = 0
        this.init()
    }

    private init(){
        let lengthLeft = this.radius        
        let distance = 0
        for(let i = 0; i<this.fragments; i++){
            const length = lengthLeft/2
            lengthLeft-=length
            this.segments.push({
                angle: 0,
                length: length,
                distance: distance
            })
            distance+=length
        }                
    }

    public animate(delta:number){
        this.g.clear()
        this.drawCenter()
        this.drawSegments()
        this.calcMovement()
    }

    private drawCenter(){
        this.g.lineStyle(2, 0x77FFAA    )
        this.g.drawCircle(this.center.x, this.center.y, this.radius)
        this.g.drawCircle(this.center.x, this.center.y, 1)
        this.g.lineStyle(0)
    }

    private drawSegments(){
        this.g.lineStyle(2, 0xAAAAAA)
        for(const s of this.segments) {
            const from = findPointWithAngle(this.center, s.angle, s.distance)
            const to = findPointWithAngle(this.center, s.angle, s.distance+s.length)
            this.g.moveTo(from.x, from.y)
            this.g.lineTo(to.x, to.y)            
        }
        this.g.lineStyle(0)
    }

    private calcMovement(){
        const f = this.segments.filter(s => s.angle < this.angleGoal)        
        f.length == 0? this.angleGoal+=45 : false
        for(let i = 0; i< this.segments.length; i++) {
            const s = this.segments[i]
            s.angle < this.angleGoal? s.angle+=2**i : s.angle = s.angle       
            s.angle > this.angleGoal? s.angle = this.angleGoal : false
        }
        for(const s of this.segments){
            
        }
    }
}


interface IRadarSegment {
    angle: number
    length: number
    distance: number
}