<template>
  <div
    class="container custom-modal"
    ref="modal"
    :style="{ maxWidth: modalWidth, width: '100%' }"
  >
    <div
      ref="draggableContainer"
      class="modal fade"
      :id="id"
      tabindex="-1"
      :aria-labelledby="id + 'DraggableModalLabel'"
      aria-hidden="true"
      style="position: absolute"
    >
      <div
        class="modal-dialog modal-dialog-centered"
        :style="{ maxWidth: modalWidth }"
      >
        <div class="modal-content" style="width: 100%">
          <div class="modal-header">
            <div
              id="drag-indicator-fpwd"
              style="
                display: inline-table;
                cursor: crosshair;
                width: 24px;
                margin-right: 10px;
              "
              @mousedown="dragMouseDown"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#777777"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path
                  d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                />
              </svg>
            </div>
            <div style="width: 100%; display: inline-table; text-align: left">
              <div>
                <h5 class="modal-title">{{ modalTitle }}</h5>
              </div>
              <div
                v-if="modalSubtitle"
                style="font-size: 0.8em; font-style: italic"
              >
                {{ modalSubtitle }}
              </div>
            </div>
            <div style="display: inline-table">
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
          </div>
          <div
            class="modal-body"
            style="max-height: calc(100vh - 200px); overflow-y: auto"
          >
            <slot ref="modalMain" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//importing bootstrap 5
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Modal } from "bootstrap";

export default {
  name: "DraggableModal",
  props: {
    id: {
      type: String,
    },
    modalTitle: {
      type: String,
    },
    loading: {
      type: String,
      required: false,
      default: "Wait",
    },
    modalSubtitle: {
      type: String,
      required: false,
    },
    modalWidth: {
      type: String,
      required: false,
      default: "540px",
    },
  },
  data: function () {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0,
      },
      modalInstance: undefined,
    };
  },

  //?? can it handle more than one modal on a page?
  mounted() {
    const modalElement = this.$refs.modal;
    // bootstrap triggers shown after the modal is displayed, show just before the modal is going to be displayed
    modalElement.addEventListener("shown.bs.modal", this.onModalShown);
    modalElement.addEventListener("show.bs.modal", this.onModalShow);
    this.modalInstance = new Modal(this.$refs.draggableContainer);
  },

  methods: {
    onModalShown(event) {
      this.$emit("modalShown", event);
    },
    onModalShow(event) {
      this.$emit("modalShow", event);
    },

    dragMouseDown: function (event) {
      event.preventDefault();

      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;

      this.$refs.draggableContainer.style.top = "0px";

      document.onmousemove = this.elementDrag;
      document.onmouseup = this.closeDragElement;
    },
    elementDrag: function (event) {
      event.preventDefault();
      this.positions.movementX = this.positions.clientX - event.clientX;
      this.positions.movementY = this.positions.clientY - event.clientY;
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      // set the element's new position:

      this.$refs.draggableContainer.style.top =
        this.$refs.draggableContainer.offsetTop -
        this.positions.movementY +
        "px";
      this.$refs.draggableContainer.style.left =
        this.$refs.draggableContainer.offsetLeft -
        this.positions.movementX +
        "px";
    },
    closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    },
    open() {
      if (this.modalInstance) {
        this.modalInstance.show();
      }
    },
    close() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    },
  },
};
</script>
<style scoped>
.custom-modal .modal-dialog {
  max-width: 1000px;
}

.custom-modal .modal-content {
  width: 100%;
}
</style>
