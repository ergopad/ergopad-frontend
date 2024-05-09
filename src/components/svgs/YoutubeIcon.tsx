import React, { FC } from 'react'
import SvgIcon from '@mui/material/SvgIcon'
import { SxProps } from '@mui/material'

const YoutubeIcon: FC<{ sx?: SxProps }> = ({ sx }) => {
  return (
    <SvgIcon sx={sx}>
      <path d="M12.0763 2.99976H12.2098C13.4428 3.00426 19.6903 3.04926 21.3748 3.50226C21.884 3.64051 22.348 3.90999 22.7205 4.28377C23.093 4.65755 23.3608 5.12253 23.4973 5.63226C23.6488 6.20226 23.7553 6.95676 23.8273 7.73526L23.8423 7.89126L23.8753 8.28126L23.8873 8.43726C23.9848 9.80826 23.9968 11.0923 23.9983 11.3728V11.4853C23.9968 11.7763 23.9833 13.1473 23.8753 14.5753L23.8633 14.7328L23.8498 14.8888C23.7748 15.7468 23.6638 16.5988 23.4973 17.2258C23.3612 17.7357 23.0935 18.2009 22.721 18.5747C22.3485 18.9486 21.8842 19.2179 21.3748 19.3558C19.6348 19.8238 13.0213 19.8568 12.1048 19.8583H11.8918C11.4283 19.8583 9.51126 19.8493 7.50126 19.7803L7.24626 19.7713L7.11576 19.7653L6.85926 19.7548L6.60276 19.7443C4.93776 19.6708 3.35226 19.5523 2.62176 19.3543C2.11249 19.2166 1.64835 18.9474 1.27584 18.5739C0.903331 18.2003 0.635526 17.7354 0.499256 17.2258C0.332756 16.6003 0.221756 15.7468 0.146756 14.8888L0.134756 14.7313L0.122756 14.5753C0.0487273 13.5589 0.00770566 12.5403 -0.000244141 11.5213L-0.000244141 11.3368C0.00275586 11.0143 0.0147559 9.89976 0.0957559 8.66976L0.106256 8.51526L0.110756 8.43726L0.122756 8.28126L0.155756 7.89126L0.170756 7.73526C0.242756 6.95676 0.349256 6.20076 0.500756 5.63226C0.636796 5.12233 0.904499 4.65712 1.27703 4.28328C1.64955 3.90944 2.11381 3.64009 2.62326 3.50226C3.35376 3.30726 4.93926 3.18726 6.60426 3.11226L6.85926 3.10176L7.11726 3.09276L7.24626 3.08826L7.50276 3.07776C8.93032 3.03182 10.3585 3.00632 11.7868 3.00126H12.0763V2.99976ZM9.59976 7.81476V15.0418L15.8353 11.4298L9.59976 7.81476Z" />
    </SvgIcon>
  )
}

export default YoutubeIcon
