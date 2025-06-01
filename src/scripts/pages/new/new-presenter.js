export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }
  
  async postNewReport({ description, photo, lat, lon }) {
    try {
      const data = {
        description: String(description),
        photo: photo,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      };
  
      
      const result = await Swal.fire({
        title: "Do you want to save the story?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
      });
      
      if (result.isConfirmed) {
        const response = await this.#model.storeNewReport(data);
        if (!response.ok) {
          console.error('postNewReport: response:', response);
          this.#view.storeFailed(response.message);
          return response; 
        }
        
        Swal.fire("Saved!", "", "success");
        this.#view.showSubmitLoadingButton();
        this.#view.storeSuccessfully(response.message, response.listStory);
        return response;
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
        return { ok: false, message: "User denied saving the story." }; 
      }
    } catch (error) {
      console.error('postNewReport: error:', error);
      this.#view.storeFailed(error.message);
      return { ok: false, message: error.message };
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
