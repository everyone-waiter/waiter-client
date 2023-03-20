export function NotFound() {
  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-5">
      <section className="error-page section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-12">
              <div className="error-inner">
                <h1>
                  404<span>해당 페이지를 찾을 수 없습니다!</span>
                </h1>
                <p>존재하지 않는 주소를 입력하셨거나, 요청하신 주소가 변경 또는 삭제되어 찾을 수 없습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
