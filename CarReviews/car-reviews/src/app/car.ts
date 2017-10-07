export class Car {
    name: string;
    company: string;
    description: string;
    image_url: string;
    // TODO we can't string enum for this version. car.state = pending/approved/rejected
    state: string; 
}