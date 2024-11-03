import AccountIcon from "../assets/account-icon.png";
import BlockIcon from "../assets/blocks-icon.png";
import DashboardIcon from "../assets/dashboard-icon.png";
import PoolIcon from "../assets/pools-icon.png";
import TokenImage from "../assets/token-image.png";
import TransactionImage from "../assets/transactions-icon.png";

const iconList = [
  { name: "Dashboard", icon: DashboardIcon, link: '/' },
  { name: "Blocks", icon: BlockIcon, link: '/blocks'},
  { name: "Transactions", icon: TransactionImage, link: '/transactions' },
  { name: "Pools", icon: PoolIcon, link: '/pools' },
  { name: "Token", icon: TokenImage, link: '/tokens'},
  { name: "Accounts", icon: AccountIcon, link: '/accounts' },
];

function Menu() {
  return (
    <div className="h-screen bg-secondaryBg overflow-y-auto fixed">
      <ul className="menu">
        {iconList.map((icon) => (
          <li key={icon.name}>
            <a className="flex flex-col items-center" href={icon.link}>
              <div className="bg-white rounded-full p-2">
                <img src={icon.icon} className="w-6" alt={icon.name} />
              </div>
              <p className="text-white">{icon.name}</p>
            </a>
            <hr className="rounded-none" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
