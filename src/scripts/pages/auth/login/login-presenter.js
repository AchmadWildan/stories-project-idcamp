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
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Sign in Failed",
          text: "Pastikan email dan password benar!",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          location.hash = '/login';
        });
        return
        // console.error('getLogin: response:', response);
        // this.#view.loginFailed(response.message);
        // return;
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Sign in successfully",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        this.#authModel.putAccessToken(response.loginResult.token);
        this.#view.loginSuccessfully(response.message, response.loginResult);
        location.hash = '/home';
      });
    } catch (error) {
      Swal.fire({
          position: "center",
          icon: "error",
          title: "Sign in Failed",
          text: "Something went wrong!",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          location.hash = '/login';
        });
        return
      // console.error('getLogin: error:', error);
      // this.#view.loginFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
