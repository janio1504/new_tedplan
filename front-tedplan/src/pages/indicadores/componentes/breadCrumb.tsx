import Link from 'next/link';
import { useRouter } from 'next/router';
import { breadCrumb } from '@/util/util';
import {BreadCrumbStyle} from '@/styles/indicadores';  

const labelMap: Record<string, string> = {
  dados_municipio: 'Cadastro',
  gestao: 'Gestão',
};

export default function BreadCrumb(){
    const {pathname} = useRouter();
    const breadcrumbs = breadCrumb(pathname).filter(
        b => b.name.toLowerCase() !== 'indicadores'
    );;

return (
    <BreadCrumbStyle>
    <nav> 
      <ol>
        <li>
                      <Link href="/indicadores/home_indicadores">
            Home
          </Link>
        </li>
        {breadcrumbs.map((list, index) => {
          const label = labelMap[list.name.toLowerCase()] || list.name;
          return(
          <li key={list.href}>
            {index === breadcrumbs.length - 1 ? (
              <>
                <span> / </span>
                <span>{label}</span>
              </>
            ) : (
              <Link href={list.href}>
                {list.name}
              </Link>
            )}
          </li>
          );
        })}
      </ol>
    </nav>
    </BreadCrumbStyle>
  );
}