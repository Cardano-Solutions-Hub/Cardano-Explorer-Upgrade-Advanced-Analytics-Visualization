import { useState } from 'react';

function NavBar() {
  // Set default language to English
  const [language, setLanguage] = useState('English');

  const changeLanguage = (lang) => {
    setLanguage(lang);
    // Add your language change logic here (e.g., updating the app context)
  };

  return (
    <div className="navbar bg-base-100 bg-secondaryBg text-primaryFont border-b sticky top-0 z-10"> {/* Make navbar sticky */}
      <div className="flex-none">
        <a className="btn btn-ghost text-xl" href='/'>ForgeSmit</a>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="form-control w-5/6">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full"
          />
        </div>
      </div>
      <div className="flex-none gap-2">
        {/* Language Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost">
            {language} {/* Display the current language */}
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-32 p-2 shadow"
          >
            <li onClick={() => changeLanguage('English')}>
              <a>English</a>
            </li>
            <li onClick={() => changeLanguage('Amharic')}>
              <a>Amharic</a>
            </li>
          </ul>
        </div>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
