import { DealHistory } from "@/entities/dealHistory.entity";
import { setSeederFactory } from "typeorm-extension";

export const DealHistoryFactory = setSeederFactory(DealHistory, async (faker) => {
    const dealHistory = new DealHistory();
    dealHistory.title = faker.lorem.words(3);
    dealHistory.description = faker.lorem.paragraph();
    dealHistory.price = faker.number.int({ min: 5, max: 100 }) * 100;
    dealHistory.dealDate = faker.date.past();
    dealHistory.status = faker.helpers.arrayElement(['Processing', 'Done']);
    dealHistory.type = faker.helpers.arrayElement(['Criminal', 'Civil', 'Corporate']);
    dealHistory.userId = faker.number.int({ min: 1, max: 2 });
    dealHistory.lawyerId = faker.number.int({ min: 1, max: 2 });

    return dealHistory;
})