export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async getLogin({ email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.getLogin({ email, password });
      if (!response.ok) {
        console.error('getLogin: response:', response);
        this.#view.loginFailed(response.message);
        return;
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Sign in successfully",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        location.hash = '/';
        this.#authModel.putAccessToken(response.loginResult.token);
        this.#view.loginSuccessfully(response.message, response.loginResult);
      });
    } catch (error) {
      console.error('getLogin: error:', error);
      this.#view.loginFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
