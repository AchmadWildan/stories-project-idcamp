import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import HomePage from '../pages/home/home-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import NewPage from '../pages/new/new-page';
import StoriesDetailPage from '../pages/stories-detail/stories-detail-page';
import NotFoundPage from '../pages/not-found/not-found-page';
import { checkUnauthenticatedRouteOnly, checkAuthenticatedRoute } from '../utils/auth';

const routes = (url) => {
  switch (url) {
    case '/login':
      return checkUnauthenticatedRouteOnly(new LoginPage());
    case '/register':
      return checkUnauthenticatedRouteOnly(new RegisterPage());
    case '/':
    case '/home':
      return checkAuthenticatedRoute(new HomePage());
    case '/bookmark':
      return checkAuthenticatedRoute(new BookmarkPage());
    case '/new':
      return checkAuthenticatedRoute(new NewPage());
    case '/stories-detail/:id':
      return checkAuthenticatedRoute(new StoriesDetailPage());
    default:
      return new NotFoundPage();
  }
};
export default routes;
