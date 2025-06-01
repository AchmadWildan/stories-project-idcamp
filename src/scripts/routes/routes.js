import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import HomePage from '../pages/home/home-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import NewPage from '../pages/new/new-page';
import StoriesDetailPage from '../pages/stories-detail/stories-detail-page';
import NotFoundPage from '../pages/not-found/not-found-page';
import { checkUnauthenticatedRouteOnly, checkAuthenticatedRoute } from '../utils/auth';

const routes = {
  '/login': checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/': checkAuthenticatedRoute(new HomePage()),
  '/home': checkAuthenticatedRoute(new HomePage()),
  '/bookmark': checkAuthenticatedRoute(new BookmarkPage()),
  '/new': checkAuthenticatedRoute(new NewPage()),
  '/stories-detail/:id': checkAuthenticatedRoute(new StoriesDetailPage()),
  '/404': new NotFoundPage(),
};
export default routes;
