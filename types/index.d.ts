interface Day {
  date: string;
}

type Week = Day[];

interface GithubUser {
  id: number;
  login: string;
  avatar_url?: string;
  bio?: string;
  name?: string;
}
