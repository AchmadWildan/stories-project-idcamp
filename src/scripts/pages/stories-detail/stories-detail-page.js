import {
  generateCommentsListEmptyTemplate,
  generateCommentsListErrorTemplate,
  generateLoaderAbsoluteTemplate,
  generateRemoveReportButtonTemplate,
  generateReportCommentItemTemplate,
  generateReportDetailErrorTemplate,
  generateReportDetailTemplate,
  generateSaveReportButtonTemplate,
} from '../../templates';
import { createCarousel } from '../../utils';
import ReportDetailPresenter from './stories-detail-presenter';
import { parseActivePathname } from '../../routes/url-parser';
import * as CityCareAPI from '../../data/api';
import Map from '../../utils/map';
import Database from '../../data/database';

export default class ReportDetailPage {
  #presenter = null;
  #form = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="report-detail__container">
          <div id="report-detail" class="report-detail"></div>
          <div id="report-detail-loading-container"></div>
        </div>
      </section>
      
    `;
  }

  async afterRender() {
    this.#presenter = new ReportDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: CityCareAPI,
      dbModel: Database,
    });


    this.#presenter.showReportDetail();

  }

  async populateReportDetailAndInitialMap(message, report) {
    document.getElementById('report-detail').innerHTML = generateReportDetailTemplate({

      description: report.description,

      photoUrl: report.photoUrl,

      lat: report.lat,
      name: report.name,
      createdAt: report.createdAt,
      lon: report.lon,
      placeName: report.placeName,
    });

    createCarousel(document.getElementById('images'));


    await this.#presenter.showReportDetailMap();
    if (this.#map) {
      const reportCoordinate = [report.lat, report.lon];
      const markerOptions = { alt: report.name };
      const popupOptions = { content: report.name };
      this.#map.changeCamera(reportCoordinate);
      this.#map.addMarker(reportCoordinate, markerOptions, popupOptions);
    }

    this.#presenter.showSaveButton();
  }

  populateReportDetailError(message) {
    document.getElementById('report-detail').innerHTML = generateReportDetailErrorTemplate(message);
  }
  populateCommentsListEmpty() {
    document.getElementById('report-detail-comments-list').innerHTML =
      generateCommentsListEmptyTemplate();
  }

  populateCommentsListError(message) {
    document.getElementById('report-detail-comments-list').innerHTML =
      generateCommentsListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }


  postNewCommentSuccessfully(message) {
    console.log(message);

    this.#presenter.getCommentsList();
    this.clearForm();
  }

  postNewCommentFailed(message) {
    alert(message);
  }

  clearForm() {
    this.#form.reset();
  }

  renderSaveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateSaveReportButtonTemplate();

    document.getElementById('report-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveReport();
      await this.#presenter.showSaveButton();
    });
  }
  saveToBookmarkSuccessfully(message) {
    console.log(message);
  }
  saveToBookmarkFailed(message) {
    alert(message);
  }
  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateRemoveReportButtonTemplate();

    document.getElementById('report-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeReport();
      await this.#presenter.showSaveButton();
    });
  }
  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  }
  removeFromBookmarkFailed(message) {
    alert(message);
  }

  showReportDetailLoading() {
    document.getElementById('report-detail-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideReportDetailLoading() {
    document.getElementById('report-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showCommentsLoading() {
    document.getElementById('comments-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideCommentsLoading() {
    document.getElementById('comments-list-loading-container').innerHTML = '';
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Tanggapi
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Tanggapi</button>
    `;
  }
}
