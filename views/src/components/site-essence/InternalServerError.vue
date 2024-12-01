<template>
  <div
    class="d-flex container-fluid justify-content-center align-items-center"
    style="height: 100vh"
  >
    <form @submit.prevent="submitForm">
      <div class="content signin-form" style="width: 1000px">
        <div class="row mb-3 mt-3">
          <div class="col-6">
            <div class="row">
              <div class="col-12">Mathlete</div>
            </div>
            <div class="row">
              <div class="col-12">
                <h1>Oops!</h1>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <h3>Well, this is unexpected</h3>
              </div>
            </div>
            <div class="row">
              <div class="col-12">Error Code: 500</div>
            </div>
            <div class="row" style="margin-top: 10px">
              <div class="col-12">
                Something seems to be broken and we are working to fix the
                problem! We apologize for the inconvenience. Please try again
                later
              </div>
            </div>
          </div>

          <div class="col-6">
            <img
              src="../../../public/assets/broken.png"
              style="height: 400px"
            />
          </div>
        </div>
        <div class="row">
          <div
            class="col-12"
            style="height: 35px; background-color: #111224"
          ></div>
        </div>
      </div>
    </form>
  </div>
</template>
