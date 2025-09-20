export enum Seasons {
    SUMMER = 'summer', SPRING = 'spring', WINTER = 'winter', FALL = 'fall'
}

export type SeasonPalette = {
    winter: string;
    summer: string;
    spring: string;
    fall: string;
};

let activeSeason = Seasons.SPRING;

export const getActiveSeason = (): Seasons => activeSeason;
export const setActiveSeason = (season: Seasons) => {
    const { stage } = window as any;
    activeSeason = season;

    stage.className = '';
    stage.classList.add(activeSeason);
};
export const incrementSeason = () => {
    switch(getActiveSeason()) {
        case Seasons.SPRING:
            setActiveSeason(Seasons.SUMMER)
            break
        case Seasons.SUMMER:
            setActiveSeason(Seasons.FALL)
            break
        case Seasons.FALL:
            setActiveSeason(Seasons.WINTER)
            break
        case Seasons.WINTER:
            setActiveSeason(Seasons.SPRING)
            break
    }
}