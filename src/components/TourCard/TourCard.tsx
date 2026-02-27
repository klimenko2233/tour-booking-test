import type { TourWithHotel } from '../../store/slices/tourSearchSelectors';
import './TourCard.css';

type TourCardProps = {
  tour: TourWithHotel;
  countryFlag?: string;
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function TourCard({ tour, countryFlag }: TourCardProps) {
  const { offer, hotel } = tour;

  return (
    <article className="tour-card">
      <div className="tour-card__media">
        {hotel?.img ? (
          <img
            src={hotel.img}
            alt=""
            className="tour-card__img"
            loading="lazy"
          />
        ) : (
          <div className="tour-card__img-placeholder" aria-hidden />
        )}
      </div>
      <div className="tour-card__body">
        <h3 className="tour-card__title">
          {hotel?.name ?? 'Готель'}
        </h3>
        {hotel && (
          <p className="tour-card__location">
            {countryFlag && (
              <img
                src={countryFlag}
                alt=""
                className="tour-card__flag"
                width={20}
                height={15}
              />
            )}
            <span>{hotel.cityName}, {hotel.countryName}</span>
          </p>
        )}
        <p className="tour-card__dates">
          {formatDate(offer.startDate)} – {formatDate(offer.endDate)}
        </p>
        <p className="tour-card__price">
          {offer.amount.toLocaleString('uk-UA')} {offer.currency.toUpperCase()}
        </p>
      </div>
    </article>
  );
}
