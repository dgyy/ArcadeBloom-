import {HealthReward, MaxHealthReward, Reward, StatusReward} from "../entities/reward";
import {randInt} from "kontra";
import {Player} from "../entities/player";


export interface RewardStatus {
    maxHealth?: number
    health?: number
    strength?: number
    attackSpeed?: number
    dashTimeout?: number
    dashDistance?: number
    name: string
}

export const MAX_HEALTH_REWARD = 'maxHealth'
export const STRENGTH_REWARD = 'strength'
export const ATTACK_SPEED_REWARD = 'attackSpeed'
export const DASH_TIMEOUT_REWARD = 'dashTimeout'
export const DASH_DISTANCE_REWARD = 'dashDistance'

function rewardFactory() {
    return [
        () => new Reward({maxHealth: 10, name: MAX_HEALTH_REWARD}, 9, "Become as stout as an oak.", true),
        () => new HealthReward(),
        () => new Reward({strength: 1.5, name: STRENGTH_REWARD}, 11, "Become as strong as an ox.", true),
        () => new Reward({attackSpeed: 4, name: ATTACK_SPEED_REWARD}, 12, "Let your enemies meet a swifter end.", true),
        () => new Reward({dashTimeout: 14, name: DASH_TIMEOUT_REWARD}, 13, "Become as nimble as the wind."),
        () => new Reward({dashDistance: 20, name: DASH_DISTANCE_REWARD}, 14, "Leap as far as a gazelle."),
    ]
}

export function sumRewards(map: Map<string, Reward[]>, key: string) {
    let sum = 0
    const list = map.get(key)
    if (list) {
        list.forEach((item) => {
            let amount = 0
            if (key === MAX_HEALTH_REWARD) {
                amount = item.status.maxHealth
            } else if (key === STRENGTH_REWARD) {
                amount = item.status.strength
            } else if (key === ATTACK_SPEED_REWARD) {
                amount = item.status.attackSpeed
            } else if (key === DASH_DISTANCE_REWARD) {
                amount = item.status.dashDistance
            } else if (key === DASH_TIMEOUT_REWARD) {
                amount = item.status.dashTimeout
            }
            if (amount) {
                sum += amount
            }
        })
    }
    return sum
}

export function getRewards(level: number, num: number) {
    const rewards: Reward[] = []
    const rewardPool = [...rewardFactory()]
    while (rewards.length < num) {
        const reward = rewardPool.splice(randInt(0, rewardPool.length - 1), 1)[0]
        const r = reward();
        if (r instanceof HealthReward && level == -1) {
            continue;
        }
        rewards.push(r)
    }
    return rewards
}

export {rewardFactory}