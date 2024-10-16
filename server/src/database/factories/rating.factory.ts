import { Rating } from "@/entities/rating.entity";
import { User } from "@/entities/user.entity";
import { Lawyer } from "@/entities/lawyers.entity"; 
import { setSeederFactory } from "typeorm-extension";

export const RatingFactory = setSeederFactory(Rating, async (faker) => {
    const rating = new Rating();
    rating.description = faker.lorem.paragraph();
    rating.assessment = faker.number.int({ min: 1, max: 5 });
    const user = new User();
    user.id = faker.number.int({ min: 1, max: 2 });

    const lawyer = new Lawyer();
    lawyer.id = faker.number.int({ min: 1, max: 2 });

    rating.user = user;
    rating.lawyer = lawyer;

    return rating;
});
