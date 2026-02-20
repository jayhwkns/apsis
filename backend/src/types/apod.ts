export default interface Apod {
  date: Date;
  title: string;
  credits: {
    image: {
      name: string;
      link: string;
    };
    text: {
      name: string;
      link: string;
    };
  };
  copyright: boolean;
  description: string;
  imageLink: string | undefined;
}
