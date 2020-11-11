export class Place {
  constructor(
    public id: string,
    public title: string,
    public descriptipon: string,
    public image: string,
    public price: number,
    public dateFrom: Date,
    public dateTo: Date,
    public userId: string
  ) { }
}