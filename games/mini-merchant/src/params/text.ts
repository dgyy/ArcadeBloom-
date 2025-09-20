import { GAME_ROUND, GYM_PRICE, HIRE_PRICE, MAX_GYM, MAX_HIRE } from './main'

export const HELP_COUNTER = `This is your counter, customers come here and show their shopping list
Place products from the list on the white marked area
If you provide everything on time, you will receive a tip`

export const HELP_CYCLOPS = `As everyone knows the 13th century was full of cyclops
You can hire them to carry things to your yard by clicking on the door of this house
The maximum number to hire is ${MAX_HIRE}`

export const HELP_GYM = `This is a gym, here you can pump up your arm strength by clicking on the door
This will help you to move things faster and remove unnecessary things from the yard
Max strength is ${MAX_GYM}`

export const HELP_FACTORY_BOX = `This is a factory, here you can make food boxes
Drop wood and food on the white marked area
People from 13th century love food boxes, so price is high`

export const HELP_FACTORY_BARREL = `This is a brewery, here you can make beer barrels
Drop wood, food and water on the white marked area`

export const HELP_GYM_DOOR = `Train in gym - ${GYM_PRICE} coins`
export const HELP_CYCLOPS_DOOR = `Hire cyclops - ${HIRE_PRICE} coins`

export const HELP_TEXT =
`Welcome to Mini Merchant(js13k games 2023 entry)!
You are a merchant who has to sell goods to the people of the village.
Use your mouse to interact with the world. Drag&Drop items near the stole to sell them.
Read more about possible interactions by clicking on 
You have a short life, so you have to sell as much as possible in ${GAME_ROUND / 60 / 1000} min.
TIP: Prepare more goods in your yard in advance. 
`.split('\n').map((s) => s.trim())

export const HELP_RESOURCES = `All resources around your yard are yours
Chop wood, collect food and water, make boxes and beer`
