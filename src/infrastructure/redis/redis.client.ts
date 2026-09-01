import {createClient} from 'redis'

export const redisClient = createClient({
    url : process.env.REDIS_URL!
})

redisClient.on('error', (err)=>{
    console.log("Redis Client error : ", err);
})

export const connectRedis = async () => {
    if(!redisClient.isOpen){
        redisClient.connect();
        console.log("Redis client connected");
        
    }
}

export default redisClient;