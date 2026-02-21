export default interface Apod {
  date: Date;
  title: string;
  credits: {
    // An image can have multiple people credited
    image: {
      name: string;
      link: string;
    }[];
    // Text might not be credited if it wasn't from a volunteer
    // TODO: Text credits often have credentials (ex. "(NASA, GSFC)") that are
    // linked.
    text?: {
      name: string;
      link: string;
    } | undefined;
  };
  copyright: boolean;
  description: string;
  imageLink: string | undefined;
}
